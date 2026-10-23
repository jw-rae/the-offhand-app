import { timingSafeEqual } from 'node:crypto'

const MAX_UPDATE_BYTES = 64 * 1024
const MAX_VOICE_BYTES = 20 * 1024 * 1024
const MAX_VOICE_DURATION_SECONDS = 60

export type TelegramMessage =
  | { kind: 'text'; updateId: number; userId: number; text: string }
  | { kind: 'voice'; updateId: number; userId: number; fileId: string }

export class WebhookRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN
  const authorMapJSON = process.env.TELEGRAM_USER_AUTHOR_MAP

  if (
    !botToken ||
    !/^\d+:[A-Za-z0-9_-]{30,}$/.test(botToken) ||
    !secret ||
    secret.length > 256 ||
    !/^[A-Za-z0-9_-]+$/.test(secret) ||
    !authorMapJSON
  ) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(authorMapJSON)
    if (!isRecord(parsed)) return null

    const entries = Object.entries(parsed)
    if (
      entries.length !== 2 ||
      entries.some(
        ([userId, authorId]) =>
          !/^[1-9]\d*$/.test(userId) ||
          !Number.isSafeInteger(Number(userId)) ||
          typeof authorId !== 'number' ||
          !Number.isSafeInteger(authorId) ||
          Number(authorId) <= 0,
      )
    ) {
      return null
    }

    const authorMap: Record<string, number> = {}
    for (const [userId, authorId] of entries) {
      authorMap[userId] = Number(authorId)
    }
    return { botToken, secret, authorMap }
  } catch {
    return null
  }
}

export function hasValidSecret(provided: string | null, expected: string): boolean {
  if (!provided) return false

  const providedBytes = Buffer.from(provided)
  const expectedBytes = Buffer.from(expected)
  return (
    providedBytes.byteLength === expectedBytes.byteLength &&
    timingSafeEqual(providedBytes, expectedBytes)
  )
}

export async function readTelegramUpdate(request: Request): Promise<unknown> {
  const contentType = request.headers.get('content-type')
  if (contentType?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    throw new WebhookRequestError('Expected a JSON update.', 415)
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength) {
    if (!/^\d+$/.test(contentLength)) {
      throw new WebhookRequestError('Content length is invalid.', 400)
    }
    if (Number(contentLength) > MAX_UPDATE_BYTES) {
      throw new WebhookRequestError('Update is too large.', 413)
    }
  }

  if (!request.body) {
    throw new WebhookRequestError('Update body is missing.', 400)
  }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let byteLength = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      byteLength += value.byteLength
      if (byteLength > MAX_UPDATE_BYTES) {
        await reader.cancel()
        throw new WebhookRequestError('Update is too large.', 413)
      }

      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(byteLength)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
  } catch {
    throw new WebhookRequestError('Update is not valid JSON.', 400)
  }
}

export function parseAllowedMessage(
  update: unknown,
  authorMap: Record<string, number>,
): TelegramMessage | null {
  if (
    !isRecord(update) ||
    typeof update.update_id !== 'number' ||
    !Number.isSafeInteger(update.update_id) ||
    update.update_id < 0
  ) {
    throw new WebhookRequestError('Update is invalid.', 400)
  }

  if (!isRecord(update.message)) return null

  const { message } = update
  if (
    !isRecord(message.from) ||
    typeof message.from.id !== 'number' ||
    !Number.isSafeInteger(message.from.id) ||
    message.from.id <= 0 ||
    message.from.is_bot === true ||
    !isRecord(message.chat) ||
    message.chat.type !== 'private' ||
    message.chat.id !== message.from.id
  ) {
    return null
  }

  const userId = message.from.id
  if (!Object.hasOwn(authorMap, String(userId))) return null

  if (typeof message.text === 'string') {
    if (message.text.trim().length === 0 || message.text.length > 4096) {
      throw new WebhookRequestError('Text message is empty or too long.', 400)
    }

    return {
      kind: 'text',
      updateId: update.update_id,
      userId,
      text: message.text,
    }
  }

  if (isRecord(message.voice)) {
    const { file_id: fileId, file_size: fileSize, duration } = message.voice
    if (
      typeof fileId !== 'string' ||
      fileId.length === 0 ||
      fileId.length > 512 ||
      typeof duration !== 'number' ||
      !Number.isSafeInteger(duration) ||
      duration <= 0 ||
      duration > MAX_VOICE_DURATION_SECONDS ||
      (fileSize !== undefined &&
        (typeof fileSize !== 'number' ||
          !Number.isSafeInteger(fileSize) ||
          fileSize <= 0 ||
          fileSize > MAX_VOICE_BYTES))
    ) {
      throw new WebhookRequestError('Voice message is invalid or exceeds limits.', 400)
    }

    return {
      kind: 'voice',
      updateId: update.update_id,
      userId,
      fileId,
    }
  }

  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
