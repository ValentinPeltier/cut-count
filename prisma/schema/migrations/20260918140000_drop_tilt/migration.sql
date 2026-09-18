DELETE FROM "bilan_carbone"."study_templates" WHERE "environment" = 'TILT';
DELETE FROM "bilan_carbone"."accounts" WHERE "environment" = 'TILT';
DELETE FROM "bilan_carbone"."organization_versions" WHERE "environment" = 'TILT';

UPDATE "bilan_carbone"."deactivable_features_statuses"
SET "deactivated_environments" = array_remove("deactivated_environments", 'TILT'::"common"."Environment")
WHERE 'TILT'::"common"."Environment" = ANY("deactivated_environments");

DELETE FROM "bilan_carbone"."deactivable_features_statuses"
WHERE "feature" = 'TiltSimplified';

ALTER TYPE "common"."Environment" DROP VALUE IF EXISTS 'TILT';
ALTER TYPE "bilan_carbone"."DeactivatableFeature" DROP VALUE IF EXISTS 'TiltSimplified';
