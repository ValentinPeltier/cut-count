-- Delete leftover MIP rows from shared tables before shrinking the Environment enum.
DELETE FROM "bilan_carbone"."study_templates" WHERE "environment" = 'MIP';
DELETE FROM "bilan_carbone"."accounts" WHERE "environment" = 'MIP';
DELETE FROM "bilan_carbone"."organization_versions" WHERE "environment" = 'MIP';

UPDATE "bilan_carbone"."deactivable_features_statuses"
SET "deactivated_environments" = array_remove("deactivated_environments", 'MIP'::"common"."Environment")
WHERE 'MIP'::"common"."Environment" = ANY("deactivated_environments");

DROP SCHEMA IF EXISTS "mip" CASCADE;
