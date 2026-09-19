DELETE FROM "bilan_carbone"."study_templates" WHERE "environment" = 'CLICKSON';

DELETE FROM "bilan_carbone"."users_on_study"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."study_exports"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."EngagementAction"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."StudyComment"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."contributors"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."documents"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."transition_plan_studies"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."transition_plans"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."study_tag"
WHERE "family_id" IN (
  SELECT stf."id"
  FROM "bilan_carbone"."study_tag_families" stf
  JOIN "bilan_carbone"."studies" s ON s."id" = stf."study_id"
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."study_tag_families"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."study_emission_sources"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."_EngagementActionToStudySite"
WHERE "B" IN (
  SELECT ss."id"
  FROM "bilan_carbone"."study_sites" ss
  JOIN "bilan_carbone"."studies" s ON s."id" = ss."study_id"
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."action_sites"
WHERE "study_site_id" IN (
  SELECT ss."id"
  FROM "bilan_carbone"."study_sites" ss
  JOIN "bilan_carbone"."studies" s ON s."id" = ss."study_id"
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."objective_sites"
WHERE "study_site_id" IN (
  SELECT ss."id"
  FROM "bilan_carbone"."study_sites" ss
  JOIN "bilan_carbone"."studies" s ON s."id" = ss."study_id"
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."opening_hours"
WHERE "study_site_id" IN (
  SELECT ss."id"
  FROM "bilan_carbone"."study_sites" ss
  JOIN "bilan_carbone"."studies" s ON s."id" = ss."study_id"
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."situations"
WHERE "study_site_id" IN (
  SELECT ss."id"
  FROM "bilan_carbone"."study_sites" ss
  JOIN "bilan_carbone"."studies" s ON s."id" = ss."study_id"
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."study_emission_factor_versions"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."study_sites"
WHERE "study_id" IN (
  SELECT s."id"
  FROM "bilan_carbone"."studies" s
  JOIN "bilan_carbone"."organization_versions" ov ON ov."id" = s."organization_version_id"
  WHERE ov."environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."studies"
WHERE "organization_version_id" IN (
  SELECT "id" FROM "bilan_carbone"."organization_versions" WHERE "environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."user_application_settings"
WHERE "account_id" IN (
  SELECT "id" FROM "bilan_carbone"."accounts" WHERE "environment" = 'CLICKSON'
);

DELETE FROM "bilan_carbone"."accounts" WHERE "environment" = 'CLICKSON';
DELETE FROM "bilan_carbone"."organization_versions" WHERE "environment" = 'CLICKSON';

UPDATE "bilan_carbone"."deactivable_features_statuses"
SET "deactivated_environments" = array_remove("deactivated_environments", 'CLICKSON'::"common"."Environment")
WHERE 'CLICKSON'::"common"."Environment" = ANY("deactivated_environments");

DELETE FROM "bilan_carbone"."deactivable_features_statuses"
