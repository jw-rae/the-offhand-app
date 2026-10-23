import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "telegram_update_id" varchar;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_telegram_update_id" varchar;
    CREATE UNIQUE INDEX IF NOT EXISTS "posts_telegram_update_id_idx"
      ON "posts" USING btree ("telegram_update_id");

    CREATE TABLE IF NOT EXISTS "telegram_updates" (
      "telegram_update_id" bigint PRIMARY KEY,
      "status" varchar NOT NULL CHECK ("status" IN ('processing', 'completed', 'failed')),
      "claimed_at" timestamptz NOT NULL DEFAULT now(),
      "post_id" integer,
      "created_at" timestamptz NOT NULL DEFAULT now(),
      "updated_at" timestamptz NOT NULL DEFAULT now()
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "telegram_updates";
    DROP INDEX IF EXISTS "posts_telegram_update_id_idx";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_telegram_update_id";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "telegram_update_id";
  `)
}
