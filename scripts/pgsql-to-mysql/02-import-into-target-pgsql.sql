-- Loads a cut_export dump into bilan_carbone / common on a target database.
-- Prerequisite: data already restored into schema cut_export (e.g. via psql -f cut-environment-data.sql).
-- Disables FK checks for the duration of the import.

SET session_replication_role = replica;

-- common
INSERT INTO common.users SELECT * FROM cut_export.users ON CONFLICT (id) DO NOTHING;
INSERT INTO common.organizations SELECT * FROM cut_export.organizations ON CONFLICT (id) DO NOTHING;

-- reference (CUT)
INSERT INTO bilan_carbone.cnc_versions SELECT * FROM cut_export.cnc_versions ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.cncs SELECT * FROM cut_export.cncs ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.emission_factor_import_version SELECT * FROM cut_export.emission_factor_import_version ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.emission_factors SELECT * FROM cut_export.emission_factors ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.emission_factor_versions SELECT * FROM cut_export.emission_factor_versions ON CONFLICT (emission_factor_id, import_version_id) DO NOTHING;
INSERT INTO bilan_carbone.emission_metadata SELECT * FROM cut_export.emission_metadata ON CONFLICT (emission_factor_id, language) DO NOTHING;
INSERT INTO bilan_carbone.emission_factor_parts SELECT * FROM cut_export.emission_factor_parts ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.emission_factor_part_metadata SELECT * FROM cut_export.emission_factor_part_metadata ON CONFLICT (emission_post_id, language) DO NOTHING;
INSERT INTO bilan_carbone.export_rules SELECT * FROM cut_export.export_rules ON CONFLICT (export, sub_post, type) DO NOTHING;
INSERT INTO bilan_carbone.formations SELECT * FROM cut_export.formations ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.actualities SELECT * FROM cut_export.actualities ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.deactivable_features_statuses SELECT * FROM cut_export.deactivable_features_statuses ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.secten_version SELECT * FROM cut_export.secten_version ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.secten_info SELECT * FROM cut_export.secten_info ON CONFLICT (id) DO NOTHING;

-- tenant (CUT)
INSERT INTO bilan_carbone.organization_versions SELECT * FROM cut_export.organization_versions ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.sites SELECT * FROM cut_export.sites ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.accounts SELECT * FROM cut_export.accounts ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.user_application_settings SELECT * FROM cut_export.user_application_settings ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.user_checked_steps SELECT * FROM cut_export.user_checked_steps ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.studies SELECT * FROM cut_export.studies ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.study_exports SELECT * FROM cut_export.study_exports ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.study_templates SELECT * FROM cut_export.study_templates ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.study_emission_factor_versions SELECT * FROM cut_export.study_emission_factor_versions ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.users_on_study SELECT * FROM cut_export.users_on_study ON CONFLICT (study_id, account_id) DO NOTHING;
INSERT INTO bilan_carbone.contributors SELECT * FROM cut_export.contributors ON CONFLICT (study_id, account_id, sub_post) DO NOTHING;
INSERT INTO bilan_carbone.study_sites SELECT * FROM cut_export.study_sites ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.opening_hours SELECT * FROM cut_export.opening_hours ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.situations SELECT * FROM cut_export.situations ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.study_tag_families SELECT * FROM cut_export.study_tag_families ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.study_tag SELECT * FROM cut_export.study_tag ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.study_emission_sources SELECT * FROM cut_export.study_emission_sources ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.emission_source_tag SELECT * FROM cut_export.emission_source_tag ON CONFLICT (emission_source_id, tag_id) DO NOTHING;
INSERT INTO bilan_carbone.documents SELECT * FROM cut_export.documents ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone."StudyComment" SELECT * FROM cut_export."StudyComment" ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone."EngagementAction" SELECT * FROM cut_export."EngagementAction" ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone."_EngagementActionToStudySite" SELECT * FROM cut_export."_EngagementActionToStudySite" ON CONFLICT ("A", "B") DO NOTHING;

INSERT INTO bilan_carbone.transition_plans SELECT * FROM cut_export.transition_plans ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.transition_plan_studies SELECT * FROM cut_export.transition_plan_studies ON CONFLICT (transition_plan_id, study_id) DO NOTHING;
INSERT INTO bilan_carbone.actions SELECT * FROM cut_export.actions ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.action_indicators SELECT * FROM cut_export.action_indicators ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.action_steps SELECT * FROM cut_export.action_steps ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.action_sites SELECT * FROM cut_export.action_sites ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.action_tags SELECT * FROM cut_export.action_tags ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.action_subposts SELECT * FROM cut_export.action_subposts ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.trajectories SELECT * FROM cut_export.trajectories ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.external_studies SELECT * FROM cut_export.external_studies ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.objectives SELECT * FROM cut_export.objectives ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.objective_sites SELECT * FROM cut_export.objective_sites ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.objective_tags SELECT * FROM cut_export.objective_tags ON CONFLICT (id) DO NOTHING;
INSERT INTO bilan_carbone.objective_subposts SELECT * FROM cut_export.objective_subposts ON CONFLICT (id) DO NOTHING;

SET session_replication_role = DEFAULT;

DROP SCHEMA IF EXISTS cut_export CASCADE;