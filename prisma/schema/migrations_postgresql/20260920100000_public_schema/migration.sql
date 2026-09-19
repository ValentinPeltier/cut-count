-- Move every application table, enum, and function into public; drop bilan_carbone, common, and mip.

DROP TRIGGER IF EXISTS lowercase_email_trigger ON "common"."users";
DROP TRIGGER IF EXISTS lowercase_email_trigger ON "bilan_carbone"."users";
DROP TRIGGER IF EXISTS trg_check_matching_source ON "bilan_carbone"."study_emission_factor_versions";
DROP TRIGGER IF EXISTS trg_validate_account_org_env ON "bilan_carbone"."accounts";
DROP TRIGGER IF EXISTS trg_validate_study_site ON "bilan_carbone"."study_emission_sources";

DROP FUNCTION IF EXISTS "bilan_carbone"."enforce_email_lowercase"();
DROP FUNCTION IF EXISTS "bilan_carbone"."check_matching_source"();
DROP FUNCTION IF EXISTS "bilan_carbone"."validate_account_organization_version_env"();
DROP FUNCTION IF EXISTS "bilan_carbone"."validate_study_site_id"();

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname IN ('bilan_carbone', 'common')
    ORDER BY schemaname, tablename
  LOOP
    EXECUTE format('ALTER TABLE %I.%I SET SCHEMA public', rec.schemaname, rec.tablename);
  END LOOP;
END $$;

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT n.nspname AS schema_name, t.typname AS type_name
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname IN ('bilan_carbone', 'common')
      AND t.typtype = 'e'
    ORDER BY n.nspname, t.typname
  LOOP
    EXECUTE format('ALTER TYPE %I.%I SET SCHEMA public', rec.schema_name, rec.type_name);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.enforce_email_lowercase()
RETURNS trigger AS $$
BEGIN
  IF NEW.email IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.email IS DISTINCT FROM OLD.email) THEN
    NEW.email := lower(NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lowercase_email_trigger
BEFORE INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.enforce_email_lowercase();

CREATE OR REPLACE FUNCTION public.check_matching_source()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  real_source text;
BEGIN
  SELECT source::text
  INTO   real_source
  FROM   public.emission_factor_import_version
  WHERE  id = NEW.import_version_id;

  IF real_source IS NOT NULL AND real_source = NEW.source::text THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION
    'Mismatch: import_version_id % a la source %, alors que NEW.source = %',
    NEW.import_version_id, real_source, NEW.source;
END;
$$;

CREATE TRIGGER trg_check_matching_source
BEFORE INSERT OR UPDATE ON public.study_emission_factor_versions
FOR EACH ROW
EXECUTE FUNCTION public.check_matching_source();

DROP SCHEMA IF EXISTS "mip" CASCADE;
DROP SCHEMA IF EXISTS "bilan_carbone" CASCADE;
DROP SCHEMA IF EXISTS "common" CASCADE;
