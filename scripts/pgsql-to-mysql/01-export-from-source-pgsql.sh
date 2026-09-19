#!/usr/bin/env bash

# Export Count!/CUT data only from a shared PostgreSQL database.
#
# Usage:
#   DATABASE_URL='postgresql://bilancarbone:bilancarbone@localhost:5432/bilancarbone' \
#     ./01-export-from-source-pgsql.sh [output.sql]

set -euo pipefail

OUTPUT_FILE="${1:-cut-environment-data.sql}"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

echo "Preparing cut_export schema..."
psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 <<'EOSQL'
-- Builds schema cut_export with COUNT/CUT data only (no MIP, no BC/TILT/CLICKSON tenant rows).

CREATE SCHEMA cut_export;

-- ---------------------------------------------------------------------------
-- Scope: organization versions (CUT + parent hierarchy within CUT)
-- ---------------------------------------------------------------------------
CREATE TEMP TABLE cut_organization_version_ids AS
WITH RECURSIVE cut_ov AS (
  SELECT id, parent_id
  FROM bilan_carbone.organization_versions
  WHERE environment = 'CUT'::common."Environment"
  UNION
  SELECT ov.id, ov.parent_id
  FROM bilan_carbone.organization_versions ov
  INNER JOIN cut_ov c ON ov.id = c.parent_id
  WHERE ov.environment = 'CUT'::common."Environment"
)
SELECT id FROM cut_ov;

CREATE TEMP TABLE cut_organization_ids AS
SELECT DISTINCT organization_id AS id
FROM bilan_carbone.organization_versions
WHERE id IN (SELECT id FROM cut_organization_version_ids);

CREATE TEMP TABLE cut_account_ids AS
SELECT id FROM bilan_carbone.accounts WHERE environment = 'CUT'::common."Environment";

CREATE TEMP TABLE cut_user_ids AS
SELECT DISTINCT user_id AS id
FROM bilan_carbone.accounts
WHERE id IN (SELECT id FROM cut_account_ids);

CREATE TEMP TABLE cut_study_ids AS
SELECT id
FROM bilan_carbone.studies
WHERE organization_version_id IN (SELECT id FROM cut_organization_version_ids);

CREATE TEMP TABLE cut_study_site_ids AS
SELECT id FROM bilan_carbone.study_sites WHERE study_id IN (SELECT id FROM cut_study_ids);

CREATE TEMP TABLE cut_transition_plan_ids AS
SELECT id FROM bilan_carbone.transition_plans WHERE study_id IN (SELECT id FROM cut_study_ids)
UNION
SELECT transition_plan_id
FROM bilan_carbone.transition_plan_studies
WHERE study_id IN (SELECT id FROM cut_study_ids);

CREATE TEMP TABLE cut_action_ids AS
SELECT id FROM bilan_carbone.actions WHERE transition_plan_id IN (SELECT id FROM cut_transition_plan_ids);

CREATE TEMP TABLE cut_trajectory_ids AS
SELECT id FROM bilan_carbone.trajectories WHERE transition_plan_id IN (SELECT id FROM cut_transition_plan_ids);

CREATE TEMP TABLE cut_objective_ids AS
SELECT id FROM bilan_carbone.objectives WHERE trajectory_id IN (SELECT id FROM cut_trajectory_ids);

CREATE TEMP TABLE cut_engagement_action_ids AS
SELECT id FROM bilan_carbone."EngagementAction" WHERE study_id IN (SELECT id FROM cut_study_ids);

-- Emission factor import versions (CUT app: all CUT + Legifrance + Base Empreinte versions)
CREATE TEMP TABLE cut_import_version_ids AS
SELECT id
FROM bilan_carbone.emission_factor_import_version efiv
WHERE efiv.source IN (
  'CUT'::bilan_carbone."Import",
  'Legifrance'::bilan_carbone."Import",
  'BaseEmpreinte'::bilan_carbone."Import"
);

CREATE TEMP TABLE cut_emission_factor_ids AS
SELECT DISTINCT emission_factor_id AS id
FROM bilan_carbone.emission_factor_versions
WHERE import_version_id IN (SELECT id FROM cut_import_version_ids)
UNION
SELECT DISTINCT emission_factor_id AS id
FROM bilan_carbone.study_emission_sources
WHERE study_id IN (SELECT id FROM cut_study_ids)
  AND emission_factor_id IS NOT NULL
UNION
SELECT id
FROM bilan_carbone.emission_factors
WHERE organization_id IN (SELECT id FROM cut_organization_ids);

CREATE TEMP TABLE cut_secten_version_ids AS
SELECT DISTINCT secten_version_id AS id
FROM bilan_carbone.transition_plans
WHERE id IN (SELECT id FROM cut_transition_plan_ids)
  AND secten_version_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- common
-- ---------------------------------------------------------------------------
CREATE TABLE cut_export.users AS
SELECT u.*
FROM common.users u
WHERE u.id IN (SELECT id FROM cut_user_ids);

CREATE TABLE cut_export.organizations AS
SELECT o.*
FROM common.organizations o
WHERE o.id IN (SELECT id FROM cut_organization_ids);

-- ---------------------------------------------------------------------------
-- Reference data used by COUNT
-- ---------------------------------------------------------------------------
CREATE TABLE cut_export.cnc_versions AS
SELECT * FROM bilan_carbone.cnc_versions;

CREATE TABLE cut_export.cncs AS
SELECT * FROM bilan_carbone.cncs;

CREATE TABLE cut_export.emission_factor_import_version AS
SELECT *
FROM bilan_carbone.emission_factor_import_version
WHERE id IN (SELECT id FROM cut_import_version_ids);

CREATE TABLE cut_export.emission_factors AS
SELECT *
FROM bilan_carbone.emission_factors
WHERE id IN (SELECT id FROM cut_emission_factor_ids);

CREATE TABLE cut_export.emission_factor_versions AS
SELECT efv.*
FROM bilan_carbone.emission_factor_versions efv
WHERE efv.emission_factor_id IN (SELECT id FROM cut_emission_factor_ids)
  AND efv.import_version_id IN (SELECT id FROM cut_import_version_ids);

CREATE TABLE cut_export.emission_metadata AS
SELECT em.*
FROM bilan_carbone.emission_metadata em
WHERE em.emission_factor_id IN (SELECT id FROM cut_emission_factor_ids);

CREATE TABLE cut_export.emission_factor_parts AS
SELECT efp.*
FROM bilan_carbone.emission_factor_parts efp
WHERE efp.emission_factor_id IN (SELECT id FROM cut_emission_factor_ids);

CREATE TABLE cut_export.emission_factor_part_metadata AS
SELECT efpm.*
FROM bilan_carbone.emission_factor_part_metadata efpm
WHERE efpm.emission_post_id IN (
  SELECT id FROM bilan_carbone.emission_factor_parts
  WHERE emission_factor_id IN (SELECT id FROM cut_emission_factor_ids)
);

CREATE TABLE cut_export.export_rules AS
SELECT * FROM bilan_carbone.export_rules;

CREATE TABLE cut_export.formations AS
SELECT * FROM bilan_carbone.formations;

CREATE TABLE cut_export.actualities AS
SELECT * FROM bilan_carbone.actualities;

CREATE TABLE cut_export.deactivable_features_statuses AS
SELECT * FROM bilan_carbone.deactivable_features_statuses;

CREATE TABLE cut_export.secten_version AS
SELECT *
FROM bilan_carbone.secten_version
WHERE id IN (SELECT id FROM cut_secten_version_ids);

CREATE TABLE cut_export.secten_info AS
SELECT si.*
FROM bilan_carbone.secten_info si
WHERE si.version_id IN (SELECT id FROM cut_secten_version_ids);

-- ---------------------------------------------------------------------------
-- CUT tenant data
-- ---------------------------------------------------------------------------
CREATE TABLE cut_export.organization_versions AS
SELECT ov.*
FROM bilan_carbone.organization_versions ov
WHERE ov.id IN (SELECT id FROM cut_organization_version_ids);

CREATE TABLE cut_export.sites AS
SELECT s.*
FROM bilan_carbone.sites s
WHERE s.organization_id IN (SELECT id FROM cut_organization_ids);

CREATE TABLE cut_export.accounts AS
SELECT a.*
FROM bilan_carbone.accounts a
WHERE a.id IN (SELECT id FROM cut_account_ids);

CREATE TABLE cut_export.user_application_settings AS
SELECT uas.*
FROM bilan_carbone.user_application_settings uas
WHERE uas.account_id IN (SELECT id FROM cut_account_ids);

CREATE TABLE cut_export.user_checked_steps AS
SELECT ucs.*
FROM bilan_carbone.user_checked_steps ucs
WHERE ucs.account_id IN (SELECT id FROM cut_account_ids);

CREATE TABLE cut_export.studies AS
SELECT st.*
FROM bilan_carbone.studies st
WHERE st.id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export.study_exports AS
SELECT se.*
FROM bilan_carbone.study_exports se
WHERE se.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export.study_templates AS
SELECT st.*
FROM bilan_carbone.study_templates st
WHERE st.environment = 'CUT'::common."Environment"
  AND st.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export.study_emission_factor_versions AS
SELECT sefv.*
FROM bilan_carbone.study_emission_factor_versions sefv
WHERE sefv.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export.users_on_study AS
SELECT uos.*
FROM bilan_carbone.users_on_study uos
WHERE uos.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export.contributors AS
SELECT c.*
FROM bilan_carbone.contributors c
WHERE c.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export.study_sites AS
SELECT ss.*
FROM bilan_carbone.study_sites ss
WHERE ss.id IN (SELECT id FROM cut_study_site_ids);

CREATE TABLE cut_export.opening_hours AS
SELECT oh.*
FROM bilan_carbone.opening_hours oh
WHERE oh.study_site_id IN (SELECT id FROM cut_study_site_ids);

CREATE TABLE cut_export.situations AS
SELECT sit.*
FROM bilan_carbone.situations sit
WHERE sit.study_site_id IN (SELECT id FROM cut_study_site_ids);

CREATE TABLE cut_export.study_tag_families AS
SELECT stf.*
FROM bilan_carbone.study_tag_families stf
WHERE stf.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export.study_tag AS
SELECT tag.*
FROM bilan_carbone.study_tag tag
WHERE tag.family_id IN (SELECT id FROM cut_export.study_tag_families);

CREATE TABLE cut_export.study_emission_sources AS
SELECT ses.*
FROM bilan_carbone.study_emission_sources ses
WHERE ses.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export.emission_source_tag AS
SELECT est.*
FROM bilan_carbone.emission_source_tag est
WHERE est.emission_source_id IN (SELECT id FROM cut_export.study_emission_sources);

CREATE TABLE cut_export.documents AS
SELECT d.*
FROM bilan_carbone.documents d
WHERE d.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export."StudyComment" AS
SELECT sc.*
FROM bilan_carbone."StudyComment" sc
WHERE sc.study_id IN (SELECT id FROM cut_study_ids);

CREATE TABLE cut_export."EngagementAction" AS
SELECT ea.*
FROM bilan_carbone."EngagementAction" ea
WHERE ea.id IN (SELECT id FROM cut_engagement_action_ids);

CREATE TABLE cut_export."_EngagementActionToStudySite" AS
SELECT j.*
FROM bilan_carbone."_EngagementActionToStudySite" j
WHERE j."A" IN (SELECT id FROM cut_engagement_action_ids)
  AND j."B" IN (SELECT id FROM cut_study_site_ids);

CREATE TABLE cut_export.transition_plans AS
SELECT tp.*
FROM bilan_carbone.transition_plans tp
WHERE tp.id IN (SELECT id FROM cut_transition_plan_ids);

CREATE TABLE cut_export.transition_plan_studies AS
SELECT tps.*
FROM bilan_carbone.transition_plan_studies tps
WHERE tps.transition_plan_id IN (SELECT id FROM cut_transition_plan_ids);

CREATE TABLE cut_export.actions AS
SELECT act.*
FROM bilan_carbone.actions act
WHERE act.id IN (SELECT id FROM cut_action_ids);

CREATE TABLE cut_export.action_indicators AS
SELECT ai.*
FROM bilan_carbone.action_indicators ai
WHERE ai.action_id IN (SELECT id FROM cut_action_ids);

CREATE TABLE cut_export.action_steps AS
SELECT ast.*
FROM bilan_carbone.action_steps ast
WHERE ast.action_id IN (SELECT id FROM cut_action_ids);

CREATE TABLE cut_export.action_sites AS
SELECT asi.*
FROM bilan_carbone.action_sites asi
WHERE asi.action_id IN (SELECT id FROM cut_action_ids);

CREATE TABLE cut_export.action_tags AS
SELECT atg.*
FROM bilan_carbone.action_tags atg
WHERE atg.action_id IN (SELECT id FROM cut_action_ids);

CREATE TABLE cut_export.action_subposts AS
SELECT asp.*
FROM bilan_carbone.action_subposts asp
WHERE asp.action_id IN (SELECT id FROM cut_action_ids);

CREATE TABLE cut_export.trajectories AS
SELECT tr.*
FROM bilan_carbone.trajectories tr
WHERE tr.id IN (SELECT id FROM cut_trajectory_ids);

CREATE TABLE cut_export.external_studies AS
SELECT es.*
FROM bilan_carbone.external_studies es
WHERE es.transition_plan_id IN (SELECT id FROM cut_transition_plan_ids);

CREATE TABLE cut_export.objectives AS
SELECT obj.*
FROM bilan_carbone.objectives obj
WHERE obj.id IN (SELECT id FROM cut_objective_ids);

CREATE TABLE cut_export.objective_sites AS
SELECT os.*
FROM bilan_carbone.objective_sites os
WHERE os.objective_id IN (SELECT id FROM cut_objective_ids);

CREATE TABLE cut_export.objective_tags AS
SELECT ot.*
FROM bilan_carbone.objective_tags ot
WHERE ot.objective_id IN (SELECT id FROM cut_objective_ids);

CREATE TABLE cut_export.objective_subposts AS
SELECT osp.*
FROM bilan_carbone.objective_subposts osp
WHERE osp.objective_id IN (SELECT id FROM cut_objective_ids);
EOSQL

echo "Dumping cut_export data to ${OUTPUT_FILE}..."
pg_dump "${DATABASE_URL}" \
  --data-only \
  --no-owner \
  --no-privileges \
  --schema=cut_export \
  --file="${OUTPUT_FILE}"

echo "Cleaning up cut_export schema..."
psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -c "DROP SCHEMA IF EXISTS cut_export CASCADE;"

echo "Done."
