import { sql } from '@payloadcms/db-postgres'
import type { BasePayload } from 'payload'

const LEASE_MINUTES = 3

export async function claimUpdate(payload: BasePayload, updateId: number): Promise<boolean> {
  const result = await payload.db.execute({ sql: sql`
    INSERT INTO "telegram_updates" ("telegram_update_id", "status")
    VALUES (${updateId}, 'processing')
    ON CONFLICT ("telegram_update_id") DO UPDATE
    SET "status" = 'processing',
        "claimed_at" = now(),
        "updated_at" = now()
    WHERE "telegram_updates"."status" = 'failed'
       OR (
         "telegram_updates"."status" = 'processing'
         AND "telegram_updates"."claimed_at" < now() - (${LEASE_MINUTES} * interval '1 minute')
       )
    RETURNING "telegram_update_id"
  ` })

  return result.rows.length > 0
}

export async function completeUpdate(
  payload: BasePayload,
  updateId: number,
  postId: number,
): Promise<void> {
  await payload.db.execute({ sql: sql`
    UPDATE "telegram_updates"
    SET "status" = 'completed',
        "post_id" = ${postId},
        "updated_at" = now()
    WHERE "telegram_update_id" = ${updateId}
  ` })
}

export async function failUpdate(payload: BasePayload, updateId: number): Promise<void> {
  await payload.db.execute({ sql: sql`
    UPDATE "telegram_updates"
    SET "status" = 'failed',
        "updated_at" = now()
    WHERE "telegram_update_id" = ${updateId}
      AND "status" = 'processing'
  ` })
}

export async function getUpdateStatus(
  payload: BasePayload,
  updateId: number,
): Promise<'processing' | 'completed' | 'failed' | null> {
  const result = await payload.db.execute({ sql: sql`
    SELECT "status"
    FROM "telegram_updates"
    WHERE "telegram_update_id" = ${updateId}
  ` })
  const status = result.rows[0]?.status
  return status === 'processing' || status === 'completed' || status === 'failed'
    ? status
    : null
}
