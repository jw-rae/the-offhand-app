import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_site_settings_theme" AS ENUM('warm', 'cool', 'pink', 'green', 'blue');

    CREATE TABLE "site_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL DEFAULT 'The Offhand',
      "logo_id" integer,
      "theme" "enum_site_settings_theme" DEFAULT 'warm' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "site_settings_updated_at_idx" ON "site_settings" USING btree ("updated_at");
    CREATE INDEX "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "site_settings" CASCADE;
    DROP TYPE "public"."enum_site_settings_theme";
  `)
}
