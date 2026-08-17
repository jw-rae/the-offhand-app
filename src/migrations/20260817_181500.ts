import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ALTER COLUMN "theme" DROP DEFAULT;
    ALTER TABLE "site_settings" ALTER COLUMN "theme" TYPE varchar USING "theme"::varchar;
    DROP TYPE "public"."enum_site_settings_theme";

    UPDATE "site_settings" SET "theme" = 'charcoal' WHERE "theme" = 'warm';
    UPDATE "site_settings" SET "theme" = 'charcoal' WHERE "theme" = 'cool';

    CREATE TYPE "public"."enum_site_settings_theme" AS ENUM('charcoal', 'pink', 'green', 'blue', 'vintage', 'slate', 'ember', 'purple', 'khaki');
    ALTER TABLE "site_settings" ALTER COLUMN "theme" TYPE "public"."enum_site_settings_theme" USING "theme"::"public"."enum_site_settings_theme";
    ALTER TABLE "site_settings" ALTER COLUMN "theme" SET DEFAULT 'charcoal';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ALTER COLUMN "theme" DROP DEFAULT;
    ALTER TABLE "site_settings" ALTER COLUMN "theme" TYPE varchar USING "theme"::varchar;
    DROP TYPE "public"."enum_site_settings_theme";

    UPDATE "site_settings" SET "theme" = 'pink' WHERE "theme" NOT IN ('pink', 'green', 'blue');

    CREATE TYPE "public"."enum_site_settings_theme" AS ENUM('warm', 'cool', 'pink', 'green', 'blue');
    ALTER TABLE "site_settings" ALTER COLUMN "theme" TYPE "public"."enum_site_settings_theme" USING "theme"::"public"."enum_site_settings_theme";
    ALTER TABLE "site_settings" ALTER COLUMN "theme" SET DEFAULT 'pink';
  `)
}
