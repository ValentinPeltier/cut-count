-- Count!: keep only ADMIN and DEFAULT organization roles.
-- SUPER_ADMIN -> ADMIN; GESTIONNAIRE / COLLABORATOR -> DEFAULT.

UPDATE "public"."accounts"
SET "role" = 'ADMIN'
WHERE "role" = 'SUPER_ADMIN';

UPDATE "public"."accounts"
SET "role" = 'DEFAULT'
WHERE "role" IN ('COLLABORATOR', 'GESTIONNAIRE');

CREATE TYPE "public"."Role_new" AS ENUM ('ADMIN', 'DEFAULT');

ALTER TABLE "public"."accounts"
  ALTER COLUMN "role" TYPE "public"."Role_new"
  USING ("role"::text::"public"."Role_new");

DROP TYPE "public"."Role";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
