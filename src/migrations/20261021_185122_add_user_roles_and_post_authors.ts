import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'author');
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "enum_users_role" DEFAULT 'author';
  UPDATE "users"
  SET "role" = 'admin'
  WHERE "id" = (SELECT "id" FROM "users" ORDER BY "id" LIMIT 1)
    AND NOT EXISTS (SELECT 1 FROM "users" WHERE "role" = 'admin');
  ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "author_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_author_id" integer;
  UPDATE "posts"
  SET "author_id" = (SELECT "id" FROM "users" WHERE "role" = 'admin' ORDER BY "id" LIMIT 1)
  WHERE "author_id" IS NULL
    AND EXISTS (SELECT 1 FROM "users" WHERE "role" = 'admin');
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM "pg_constraint" WHERE "conname" = 'posts_author_id_users_id_fk') THEN
      ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM "pg_constraint" WHERE "conname" = '_posts_v_version_author_id_users_id_fk') THEN
      ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;
  CREATE INDEX IF NOT EXISTS "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_author_id_users_id_fk";
  
  DROP INDEX "posts_author_idx";
  DROP INDEX "_posts_v_version_version_author_idx";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "posts" DROP COLUMN "author_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_author_id";
  DROP TYPE "public"."enum_users_role";
  `)
}
