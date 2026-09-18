DELETE FROM "bilan_carbone"."study_templates" WHERE "environment" = 'CLICKSON';
DELETE FROM "bilan_carbone"."accounts" WHERE "environment" = 'CLICKSON';
DELETE FROM "bilan_carbone"."organization_versions" WHERE "environment" = 'CLICKSON';

UPDATE "bilan_carbone"."deactivable_features_statuses"
SET "deactivated_environments" = array_remove("deactivated_environments", 'CLICKSON'::"common"."Environment")
WHERE 'CLICKSON'::"common"."Environment" = ANY("deactivated_environments");

ALTER TYPE "common"."Environment" DROP VALUE IF EXISTS 'CLICKSON';
