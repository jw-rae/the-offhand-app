import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_site_settings_font_family" AS ENUM('system-sans', 'inter', 'dm-sans', 'outfit', 'lora', 'playfair', 'source-serif', 'jetbrains-mono');
    ALTER TABLE "site_settings" ADD COLUMN "font_family" "enum_site_settings_font_family" DEFAULT 'system-sans' NOT NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN "font_family";
    DROP TYPE "public"."enum_site_settings_font_family";
  `)
}
