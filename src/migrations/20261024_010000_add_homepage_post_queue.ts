import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "homepage_queue_position" numeric;
    ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_homepage_queue_position" numeric;
    CREATE UNIQUE INDEX IF NOT EXISTS "posts_homepage_queue_position_idx"
      ON "posts" USING btree ("homepage_queue_position");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "posts_homepage_queue_position_idx";
    ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_homepage_queue_position";
    ALTER TABLE "posts" DROP COLUMN IF EXISTS "homepage_queue_position";
  `)
}
