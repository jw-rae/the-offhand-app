import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "posts"
    SET "published_at" = "created_at"
    WHERE "_status" = 'published'
      AND "published_at" IS NULL;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Preserve the repaired publication dates; reverting would erase useful data.
}
