-- Drop environment-related columns and enum (Count! is the only product).

ALTER TABLE "bilan_carbone"."deactivable_features_statuses" DROP COLUMN IF EXISTS "deactivated_environments";

ALTER TABLE "bilan_carbone"."accounts" DROP COLUMN IF EXISTS "environment";

ALTER TABLE "bilan_carbone"."organization_versions" DROP COLUMN IF EXISTS "environment";

DROP TYPE IF EXISTS "public"."Environment";
