-- Drop Bilan Carbone+ product tables, collapse Environment uniqueness to Count-only,
-- and shrink SubPost / Environment / DeactivatableFeature enums.

-- 1. Drop BC-only tables (CASCADE handles join tables and FKs).
DROP TABLE IF EXISTS "bilan_carbone"."emission_source_tag" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."_TagToEmissionSource" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."study_tag" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."study_tag_families" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."study_emission_sources" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."study_exports" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."export_rules" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."contributors" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."StudyComment" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."documents" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."formations" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."actualities" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."user_checked_steps" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."study_templates" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."_EngagementActionToStudySite" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."EngagementAction" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."action_sites" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."action_tags" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."action_subposts" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."action_indicators" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."action_steps" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."actions" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."objective_sites" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."objective_tags" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."objective_subposts" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."objectives" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."trajectories" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."external_studies" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."transition_plan_studies" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."transition_plans" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."secten_info" CASCADE;
DROP TABLE IF EXISTS "bilan_carbone"."secten_version" CASCADE;

-- 2. Remove leftover BC product rows before uniqueness collapse.
DELETE FROM "bilan_carbone"."users_on_study"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'BC'
);

DELETE FROM "bilan_carbone"."opening_hours"
WHERE "study_site_id" IN (
  SELECT ss."id"
  FROM "bilan_carbone"."study_sites" ss
  JOIN "bilan_carbone"."studies" s ON s."id" = ss."study_id"
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'BC'
);

DELETE FROM "bilan_carbone"."situations"
WHERE "study_site_id" IN (
  SELECT ss."id"
  FROM "bilan_carbone"."study_sites" ss
  JOIN "bilan_carbone"."studies" s ON s."id" = ss."study_id"
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'BC'
);

DELETE FROM "bilan_carbone"."study_emission_factor_versions"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'BC'
);

DELETE FROM "bilan_carbone"."study_sites"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'BC'
);

DELETE FROM "bilan_carbone"."studies"
WHERE "organization_version_id" IN (
  SELECT "id" FROM "bilan_carbone"."organization_versions" WHERE "environment" = 'BC'
);

DELETE FROM "bilan_carbone"."user_application_settings"
WHERE "account_id" IN (
  SELECT "id" FROM "bilan_carbone"."accounts" WHERE "environment" = 'BC'
);

DELETE FROM "bilan_carbone"."accounts" WHERE "environment" = 'BC';
DELETE FROM "bilan_carbone"."organization_versions" WHERE "environment" = 'BC';

UPDATE "bilan_carbone"."deactivable_features_statuses"
SET "deactivated_environments" = array_remove("deactivated_environments", 'BC'::"common"."Environment")
WHERE 'BC'::"common"."Environment" = ANY("deactivated_environments");

DELETE FROM "bilan_carbone"."deactivable_features_statuses"
WHERE "feature" NOT IN ('Creation', 'DownloadReport');

-- 3. Collapse uniqueness: one account per user, one org version per organization.
DROP INDEX IF EXISTS "bilan_carbone"."accounts_user_id_environment_key";
DROP INDEX IF EXISTS "bilan_carbone"."organization_versions_organizationId_environment_key";

CREATE UNIQUE INDEX IF NOT EXISTS "accounts_user_id_key"
  ON "bilan_carbone"."accounts"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "organization_versions_organizationId_key"
  ON "bilan_carbone"."organization_versions"("organizationId");

-- 4. Drop unused columns.
ALTER TABLE "bilan_carbone"."organization_versions" DROP COLUMN IF EXISTS "activated_licence";

ALTER TABLE "bilan_carbone"."sites"
  DROP COLUMN IF EXISTS "volunteer_number",
  DROP COLUMN IF EXISTS "beneficiary_number",
  DROP COLUMN IF EXISTS "establishment_id",
  DROP COLUMN IF EXISTS "establishment_year",
  DROP COLUMN IF EXISTS "superficy",
  DROP COLUMN IF EXISTS "student_number",
  DROP COLUMN IF EXISTS "academy",
  DROP COLUMN IF EXISTS "establishment_type",
  DROP COLUMN IF EXISTS "country";

ALTER TABLE "bilan_carbone"."study_sites"
  DROP COLUMN IF EXISTS "volunteer_number",
  DROP COLUMN IF EXISTS "beneficiary_number",
  DROP COLUMN IF EXISTS "superficy",
  DROP COLUMN IF EXISTS "student_number",
  DROP COLUMN IF EXISTS "country";

ALTER TABLE "bilan_carbone"."accounts"
  DROP COLUMN IF EXISTS "formation_name",
  DROP COLUMN IF EXISTS "formation_start_date",
  DROP COLUMN IF EXISTS "formation_end_date";

ALTER TABLE "common"."users" DROP COLUMN IF EXISTS "formation_form_start_time";

ALTER TABLE "bilan_carbone"."accounts" ALTER COLUMN "environment" SET DEFAULT 'CUT';
ALTER TABLE "bilan_carbone"."organization_versions" ALTER COLUMN "environment" SET DEFAULT 'CUT';
ALTER TABLE "bilan_carbone"."studies" ALTER COLUMN "simplified" SET DEFAULT true;

-- 5. Shrink Environment to CUT.
CREATE TYPE "common"."Environment_new" AS ENUM ('CUT');

ALTER TABLE "bilan_carbone"."accounts" ALTER COLUMN "environment" DROP DEFAULT;
ALTER TABLE "bilan_carbone"."accounts"
  ALTER COLUMN "environment" TYPE "common"."Environment_new"
  USING ("environment"::text::"common"."Environment_new");
ALTER TABLE "bilan_carbone"."accounts" ALTER COLUMN "environment" SET DEFAULT 'CUT';

ALTER TABLE "bilan_carbone"."organization_versions" ALTER COLUMN "environment" DROP DEFAULT;
ALTER TABLE "bilan_carbone"."organization_versions"
  ALTER COLUMN "environment" TYPE "common"."Environment_new"
  USING ("environment"::text::"common"."Environment_new");
ALTER TABLE "bilan_carbone"."organization_versions" ALTER COLUMN "environment" SET DEFAULT 'CUT';

ALTER TABLE "bilan_carbone"."deactivable_features_statuses"
  ALTER COLUMN "deactivated_environments" TYPE "common"."Environment_new"[]
  USING (
    ARRAY(
      SELECT unnest("deactivated_environments")::text
      INTERSECT
      SELECT unnest(ARRAY['CUT']::text[])
    )::"common"."Environment_new"[]
  );

ALTER TYPE "common"."Environment" RENAME TO "Environment_old";
ALTER TYPE "common"."Environment_new" RENAME TO "Environment";
DROP TYPE "common"."Environment_old";

-- 6. Shrink DeactivatableFeature to Creation + DownloadReport.
CREATE TYPE "bilan_carbone"."DeactivatableFeature_new" AS ENUM ('Creation', 'DownloadReport');
ALTER TABLE "bilan_carbone"."deactivable_features_statuses"
  ALTER COLUMN "feature" TYPE "bilan_carbone"."DeactivatableFeature_new"
  USING ("feature"::text::"bilan_carbone"."DeactivatableFeature_new");
ALTER TYPE "bilan_carbone"."DeactivatableFeature" RENAME TO "DeactivatableFeature_old";
ALTER TYPE "bilan_carbone"."DeactivatableFeature_new" RENAME TO "DeactivatableFeature";
DROP TYPE "bilan_carbone"."DeactivatableFeature_old";

-- 7. Shrink SubPost to Count values (including DeplacementsProfessionnels).
CREATE TYPE "bilan_carbone"."SubPost_new" AS ENUM (
  'DeplacementsProfessionnels',
  'Batiment',
  'Equipe',
  'Energie',
  'ActivitesDeBureau',
  'MobiliteSpectateurs',
  'EquipesRecues',
  'MaterielTechnique',
  'AutreMateriel',
  'Achats',
  'Fret',
  'Electromenager',
  'DechetsOrdinaires',
  'DechetsExceptionnels',
  'MaterielDistributeurs',
  'MaterielCinema',
  'CommunicationDigitale',
  'CaissesEtBornes'
);

ALTER TABLE "bilan_carbone"."emission_factors"
  ALTER COLUMN "sub_posts" TYPE "bilan_carbone"."SubPost_new"[]
  USING (
    ARRAY(
      SELECT unnest("sub_posts")::text
      INTERSECT
      SELECT unnest(ARRAY[
        'DeplacementsProfessionnels',
        'Batiment',
        'Equipe',
        'Energie',
        'ActivitesDeBureau',
        'MobiliteSpectateurs',
        'EquipesRecues',
        'MaterielTechnique',
        'AutreMateriel',
        'Achats',
        'Fret',
        'Electromenager',
        'DechetsOrdinaires',
        'DechetsExceptionnels',
        'MaterielDistributeurs',
        'MaterielCinema',
        'CommunicationDigitale',
        'CaissesEtBornes'
      ]::text[])
    )::"bilan_carbone"."SubPost_new"[]
  );

ALTER TYPE "bilan_carbone"."SubPost" RENAME TO "SubPost_old";
ALTER TYPE "bilan_carbone"."SubPost_new" RENAME TO "SubPost";
DROP TYPE "bilan_carbone"."SubPost_old";

-- 8. Drop unused enums that nothing references after the table drops.
DROP TYPE IF EXISTS "bilan_carbone"."Export" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."ControlMode" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."EmissionSourceCaracterisation" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."CommentStatus" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."EngagementPhase" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."EmissionSourceType" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."DocumentCategory" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."UserChecklist" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."DuplicableStudy" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."Country" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."EstablishmentType" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."ActionNature" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."ActionCategory" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."ActionRelevance" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."ActionPotentialDeduction" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."action_indicator_type" CASCADE;
DROP TYPE IF EXISTS "bilan_carbone"."ActionIndicatorType" CASCADE;
