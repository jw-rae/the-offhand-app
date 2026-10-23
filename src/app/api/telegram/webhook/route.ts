import payloadConfig from '@payload-config'
import { getPayload } from 'payload'
import {
  createTelegramDraft,
  findTelegramDraft,
  getAssistantConfig,
  notifyTelegram,
  transcribeVoice,
} from '@/lib/telegram/assistant'
import {
  claimUpdate,
  completeUpdate,
  failUpdate,
  getUpdateStatus,
} from '@/lib/telegram/idempotency'
import {
  getTelegramConfig,
  hasValidSecret,
  parseAllowedMessage,
  readTelegramUpdate,
  WebhookRequestError,
} from '@/lib/telegram/webhook'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function json(body: Record<string, string>, status: number): Response {
  return Response.json(body, { status })
}

export async function POST(request: Request): Promise<Response> {
  const telegramConfig = getTelegramConfig()
  const assistantConfig = telegramConfig
    ? getAssistantConfig(telegramConfig.botToken)
    : null
  if (!telegramConfig || !assistantConfig) {
    return json({ error: 'Telegram webhook is not configured.' }, 503)
  }

  if (
    !hasValidSecret(
      request.headers.get('x-telegram-bot-api-secret-token'),
      telegramConfig.secret,
    )
  ) {
    return json({ error: 'Unauthorized.' }, 401)
  }

  try {
    const update = await readTelegramUpdate(request)
    const message = parseAllowedMessage(update, telegramConfig.authorMap)
    if (!message) return json({ ok: 'true' }, 200)

    const payload = await getPayload({ config: payloadConfig })
    const existingDraft = await findTelegramDraft(payload, message.updateId)
    if (existingDraft) return json({ ok: 'true' }, 200)

    if (!(await claimUpdate(payload, message.updateId))) {
      const status = await getUpdateStatus(payload, message.updateId)
      return status === 'completed'
        ? json({ ok: 'true' }, 200)
        : json({ error: 'Telegram update is already being processed.' }, 503)
    }

    try {
      const transcript =
        message.kind === 'voice'
          ? await transcribeVoice(message.fileId, assistantConfig)
          : null
      const post = await createTelegramDraft(
        payload,
        message,
        telegramConfig.authorMap[String(message.userId)],
        transcript,
        assistantConfig,
      )
      await completeUpdate(payload, message.updateId, post.id)

      try {
        await notifyTelegram(
          message.userId,
          post.title,
          post.id,
          telegramConfig.botToken,
        )
      } catch {
        console.warn('Telegram draft notification could not be delivered.')
      }
      return json({ ok: 'true' }, 200)
    } catch {
      try {
        await failUpdate(payload, message.updateId)
      } catch {
        console.error('Telegram update failure state could not be saved.')
      }
      console.error('Telegram update could not be converted into a draft.')
      return json({ error: 'Telegram update could not be processed.' }, 500)
    }
  } catch (error) {
    if (error instanceof WebhookRequestError) {
      return json({ error: error.message }, error.status)
    }

    console.error('Telegram webhook request could not be processed.')
    return json({ error: 'Webhook request could not be processed.' }, 500)
  }
}
