-- Squashed init: schema state before 2026-09-18 migrations (replaces 244 historical migrations).

--
--




--
-- Name: bilan_carbone; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS bilan_carbone;


--
-- Name: common; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS common;


--
-- Name: mip; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA IF NOT EXISTS mip;


--
-- Name: ActionCategory; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."ActionCategory" AS ENUM (
    'Immediate',
    'Strategic',
    'Priority',
    'Improvement',
    'Adaptation'
);


--
-- Name: ActionNature; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."ActionNature" AS ENUM (
    'Physical',
    'Reglementary',
    'Organisational',
    'Behavioural'
);


--
-- Name: ActionPotentialDeduction; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."ActionPotentialDeduction" AS ENUM (
    'Quality',
    'Quantity',
    'EmissionSources'
);


--
-- Name: ActionRelevance; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."ActionRelevance" AS ENUM (
    'Offsetting',
    'Sequestration',
    'Avoidance',
    'AvoidanceFinancing',
    'ReductionOutsideOrganisationValueChain',
    'ReductionWithinOrganisationCoreBusiness',
    'ReductionWithinOrganisationValueChain'
);


--
-- Name: CommentStatus; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."CommentStatus" AS ENUM (
    'PENDING',
    'VALIDATED'
);


--
-- Name: ControlMode; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."ControlMode" AS ENUM (
    'CapitalShare',
    'Financial',
    'Operational'
);


--
-- Name: Country; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."Country" AS ENUM (
    'ALBANIA',
    'ANDORRA',
    'AUSTRIA',
    'BELARUS',
    'BELGIUM',
    'BOSNIA_AND_HERZEGOVINA',
    'BULGARIA',
    'CROATIA',
    'CYPRUS',
    'CZECH_REPUBLIC',
    'DENMARK',
    'ESTONIA',
    'FINLAND',
    'FRANCE',
    'GERMANY',
    'GREECE',
    'HUNGARY',
    'ICELAND',
    'IRELAND',
    'ITALY',
    'KOSOVO',
    'LATVIA',
    'LIECHTENSTEIN',
    'LITHUANIA',
    'LUXEMBOURG',
    'MALTA',
    'MOLDOVA',
    'MONACO',
    'MONTENEGRO',
    'NETHERLANDS',
    'NORTH_MACEDONIA',
    'NORWAY',
    'POLAND',
    'PORTUGAL',
    'ROMANIA',
    'RUSSIA',
    'SAN_MARINO',
    'SERBIA',
    'SLOVAKIA',
    'SLOVENIA',
    'SPAIN',
    'SWEDEN',
    'SWITZERLAND',
    'UKRAINE',
    'UNITED_KINGDOM',
    'VATICAN_CITY',
    'OTHER'
);


--
-- Name: DayOfWeek; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."DayOfWeek" AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);


--
-- Name: DeactivatableFeature; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."DeactivatableFeature" AS ENUM (
    'Formation',
    'Feedback',
    'Creation',
    'DownloadReport',
    'FormationStudy',
    'TransitionPlan',
    'TiltSimplified'
);


--
-- Name: DocumentCategory; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."DocumentCategory" AS ENUM (
    'DependencyMatrix'
);


--
-- Name: DuplicableStudy; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."DuplicableStudy" AS ENUM (
    'TrainingExercise',
    'TrainingCorrectionExercise'
);


--
-- Name: EmissionFactorBase; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."EmissionFactorBase" AS ENUM (
    'LocationBased',
    'MarketBased'
);


--
-- Name: EmissionFactorPartType; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."EmissionFactorPartType" AS ENUM (
    'CarburantAmontCombustion',
    'Amont',
    'Intrants',
    'Combustion',
    'TransportEtDistribution',
    'Energie',
    'Fabrication',
    'Traitement',
    'Collecte',
    'Autre',
    'Amortissement',
    'Incineration',
    'EmissionsFugitives',
    'Fuites',
    'Transport',
    'CombustionALaCentrale',
    'Pertes',
    'AutresEmissionsLieesALaConsommationDElectriciteBarrage'
);


--
-- Name: EmissionFactorStatus; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."EmissionFactorStatus" AS ENUM (
    'Archived',
    'Valid'
);


--
-- Name: EmissionSourceCaracterisation; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."EmissionSourceCaracterisation" AS ENUM (
    'Operated',
    'NotOperated',
    'OperatedProcedeed',
    'OperatedFugitive',
    'NotOperatedSupported',
    'NotOperatedNotSupported',
    'Rented',
    'FinalClient',
    'Held',
    'NotHeldSimpleRent',
    'NotHeldOther',
    'HeldProcedeed',
    'HeldFugitive',
    'NotHeldSupported',
    'NotHeldNotSupported',
    'UsedByIntermediary',
    'OperatedCAS',
    'HeldCAS'
);


--
-- Name: EmissionSourceType; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."EmissionSourceType" AS ENUM (
    'Physical',
    'Accounting',
    'Extrapolated',
    'Statistical',
    'Approched'
);


--
-- Name: EngagementPhase; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."EngagementPhase" AS ENUM (
    'AwarnessAndOutreach',
    'Empowerment',
    'CoConstruction',
    'FeedbackAndCommunication'
);


--
-- Name: EstablishmentType; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."EstablishmentType" AS ENUM (
    'COLLEGE',
    'LYCEE_GENERAL',
    'LYCEE_PRO',
    'LYCEE_PRO_AGRICOLE',
    'ETABLISSEMENT_FR_ETRANGER'
);


--
-- Name: Export; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."Export" AS ENUM (
    'Beges',
    'GHGP',
    'ISO14069'
);


--
-- Name: Import; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."Import" AS ENUM (
    'BaseEmpreinte',
    'Manual',
    'NegaOctet',
    'Legifrance',
    'CUT',
    'CLICKSON',
    'AIB',
    'GIEC'
);


--
-- Name: Level; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."Level" AS ENUM (
    'Initial',
    'Standard',
    'Advanced'
);


--
-- Name: Role; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."Role" AS ENUM (
    'ADMIN',
    'SUPER_ADMIN',
    'GESTIONNAIRE',
    'DEFAULT',
    'COLLABORATOR'
);


--
-- Name: SiteCAUnit; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."SiteCAUnit" AS ENUM (
    'U',
    'K',
    'M'
);


--
-- Name: StudyResultUnit; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."StudyResultUnit" AS ENUM (
    'K',
    'T'
);


--
-- Name: StudyRole; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."StudyRole" AS ENUM (
    'Validator',
    'Editor',
    'Reader'
);


--
-- Name: SubPost; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."SubPost" AS ENUM (
    'CombustiblesFossiles',
    'CombustiblesOrganiques',
    'ReseauxDeChaleurEtDeVapeur',
    'ReseauxDeFroid',
    'Electricite',
    'Agriculture',
    'EmissionsLieesAuChangementDAffectationDesSolsCas',
    'EmissionsLieesALaProductionDeFroid',
    'EmissionsLieesAuxProcedesIndustriels',
    'AutresEmissionsNonEnergetiques',
    'MetauxPlastiquesEtVerre',
    'PapiersCartons',
    'MateriauxDeConstruction',
    'ProduitsChimiquesEtHydrogene',
    'NourritureRepasBoissons',
    'MatiereDestineeAuxEmballages',
    'AutresIntrants',
    'BiensEtMatieresEnApprocheMonetaire',
    'AchatsDeServices',
    'UsagesNumeriques',
    'ServicesEnApprocheMonetaire',
    'DechetsDEmballagesEtPlastiques',
    'DechetsOrganiques',
    'DechetsOrduresMenageres',
    'DechetsDangereux',
    'DechetsBatiments',
    'DechetsFuitesOuEmissionsNonEnergetiques',
    'EauxUsees',
    'FretEntrant',
    'FretInterne',
    'FretSortant',
    'DeplacementsDomicileTravail',
    'DeplacementsProfessionnels',
    'DeplacementsVisiteurs',
    'Batiments',
    'AutresInfrastructures',
    'Equipements',
    'Informatique',
    'UtilisationEnResponsabilite',
    'UtilisationEnDependance',
    'InvestissementsFinanciersRealises',
    'ConsommationDEnergieEnFinDeVie',
    'TraitementDesDechetsEnFinDeVie',
    'FuitesOuEmissionsNonEnergetiques',
    'TraitementDesEmballagesEnFinDeVie',
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
    'CaissesEtBornes',
    'AutresDechets',
    'FroidEtClim',
    'ActivitesAgricoles',
    'ActivitesIndustrielles',
    'DeplacementsDomicileTravailSalaries',
    'DeplacementsDomicileTravailBenevoles',
    'DeplacementsDansLeCadreDUneMissionAssociativeSalaries',
    'DeplacementsDansLeCadreDUneMissionAssociativeBenevoles',
    'DeplacementsDesBeneficiaires',
    'DeplacementsFabricationDesVehicules',
    'Entrant',
    'Interne',
    'Sortant',
    'TransportFabricationDesVehicules',
    'RepasPrisParLesSalaries',
    'RepasPrisParLesBenevoles',
    'UtilisationEnResponsabiliteConsommationDeBiens',
    'UtilisationEnResponsabiliteConsommationNumerique',
    'UtilisationEnResponsabiliteConsommationDEnergie',
    'UtilisationEnResponsabiliteFuitesEtAutresConsommations',
    'UtilisationEnDependanceConsommationDeBiens',
    'UtilisationEnDependanceConsommationNumerique',
    'UtilisationEnDependanceConsommationDEnergie',
    'UtilisationEnDependanceFuitesEtAutresConsommations',
    'TeletravailSalaries',
    'TeletravailBenevoles',
    'EquipementsDesSalaries',
    'ParcInformatiqueDesSalaries',
    'EquipementsDesBenevoles',
    'ParcInformatiqueDesBenevoles',
    'RepasPrisParLesBeneficiaires',
    'Combustibles',
    'AutresGaz',
    'TypesDeRepasServis',
    'DistributeursAutomatiques',
    'TransportDesEleves',
    'TransportDuPersonnel',
    'VoyagesScolaires',
    'Fournitures',
    'ProduitsChimiques',
    'EquipementsDeSport',
    'DechetsRecyclables',
    'OrduresMenageresResiduelles',
    'Construction',
    'Renovation',
    'EquipementsInformatiqueAudiovisuel',
    'EquipementsDivers',
    'DechetsEmisParLOrganisation',
    'DeplacementsBenevoles',
    'BienMatieres',
    'ConsommationsEnergieUtilisationProduits',
    'TeletravailSalariesBenevoles',
    'FinDeVieProduitsVendusFournisBeneficiaires',
    'Evenement',
    'EnergieSimplified'
);


--
-- Name: UserChecklist; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone."UserChecklist" AS ENUM (
    'CreateAccount',
    'AddCollaborator',
    'AddClient',
    'AddSiteCR',
    'AddSiteOrga',
    'CreateFirstStudy',
    'CreateFirstEmissionSource',
    'ConsultResults',
    'Completed',
    'AddSiteCRCollaborator'
);


--
-- Name: action_indicator_type; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone.action_indicator_type AS ENUM (
    'Implementation',
    'FollowUp',
    'Performance'
);


--
-- Name: trajectory_type; Type: TYPE; Schema: bilan_carbone; Owner: -
--

CREATE TYPE bilan_carbone.trajectory_type AS ENUM (
    'SBTI_15',
    'SBTI_WB2C',
    'SNBC_GENERAL',
    'SNBC_SECTORAL',
    'CUSTOM'
);


--
-- Name: Environment; Type: TYPE; Schema: common; Owner: -
--

CREATE TYPE common."Environment" AS ENUM (
    'BC',
    'CUT',
    'TILT',
    'CLICKSON',
    'MIP'
);


--
-- Name: Unit; Type: TYPE; Schema: common; Owner: -
--

CREATE TYPE common."Unit" AS ENUM (
    'A4_SHEET_100',
    'KM_100',
    'ACTIVE',
    'APPAREL',
    'RACE_KM',
    'EURO_SPENT',
    'FRANC_CFP',
    'GJ_PCI',
    'GJ_PCS',
    'HA',
    'HA_YEAR',
    'HA_CLEMENTINE',
    'HOUR',
    'KEURO',
    'KG',
    'KG_BIOGNC',
    'KG_NITROGEN_SPREAD',
    'KG_DCO_REMOVED',
    'KG_BIOWASTE',
    'KG_SOFT_WHEAT_15',
    'KG_TREATED_LEATHER',
    'KG_FABA_BEAN_15',
    'KG_GREEN_COFFEE_BEANS_NO_PULP',
    'KG_RAPESEED_9',
    'KG_WOOL',
    'KG_MILK',
    'KG_CORN_28',
    'KG_ACTIVE_MATERIAL',
    'KG_RAW_MATERIAL',
    'KG_RAW_MATERIAL_12',
    'KG_RAW_MATERIAL_15',
    'KG_RAW_MATERIAL_74',
    'KG_RAW_MATERIAL_80',
    'KG_RAW_MATERIAL_9',
    'KG_RAW_MATERIAL_16_SUGAR',
    'KG_RAW_MATERIAL_NO_PULP',
    'KG_DRY_MATTER',
    'KG_NET_WEIGHT',
    'KG_LIVE_WEIGHT',
    'KG_LIVE_WEIGHT_CAT_0',
    'KG_LIVE_WEIGHT_CAT_1',
    'KG_LIVE_WEIGHT_CAT_2',
    'KG_LIVE_WEIGHT_CAT_3',
    'KG_SPRING_PEAS_15',
    'KG_POTATO_80',
    'KG_STARCH_POTATO_74',
    'KG_TRITICALE_15',
    'KG_NET_COMMERCIALLY_VIABLE_MEAT',
    'KG_PASTURED_GRASS_80',
    'KG_INGREDIENT_EXIT_STORE_NET_WEIGHT',
    'KG_INGREDIENT_EXIT_STORE_NET_WEIGHT_GR',
    'KG_INGREDIENT_EXIT_STORE_NET_WEIGHT_GRAINS',
    'KG_INGESTED_INGREDIENT',
    'KG_EGG',
    'KG_EGG_CAT_0',
    'KG_EGG_CAT_1',
    'KG_EGG_CAT_2',
    'KG_EGG_CAT_3',
    'KG_BREWING_BARLEY_15',
    'KG_FEED_BARLEY_15',
    'KGH2',
    'KG_MILK_LIQUID',
    'KG_NTK',
    'KM',
    'KM_PERSON',
    'KWH',
    'KWH_PCI',
    'KWH_PCS',
    'LITER',
    'LITER_LIQUID',
    'POUND',
    'METER',
    'M2_SHON',
    'M3',
    'M3_KM',
    'M3_N',
    'METER_ROAD',
    'MJ_PCI',
    'ML',
    'M2',
    'M2_WALL',
    'M2_FLOOR',
    'M2_ROOF',
    'PASSENGER_KM',
    'PEQ_KM',
    'PERSON_MONTH',
    'UNIT_PIECE_SHRUB_POT',
    'UNIT_PIECE_SHRUB_POT_3L',
    'UNIT_PIECE_GRAFT',
    'UNIT_PIECE_STEM',
    'PORTION',
    'MEAL',
    'T',
    'TEP',
    'TEP_PCI',
    'TEP_PCS',
    'TON_KM',
    'TON',
    'TON_WITH_BONES',
    'TON_RAW',
    'TON_COLLECTED',
    'TON_CLINKER',
    'TON_WASTE',
    'TON_K2O',
    'TON_DRY_MATTER',
    'TON_N',
    'TON_P2O5',
    'TON_VIABLE_MEAT',
    'TON_KM_PRODUCED',
    'TON_PRODUCTED',
    'TON_PROCESSED',
    'UNIT',
    'IMPORTED_UNIT_PIECE_SHRUB_POT',
    'VEHICLE_YEAR',
    'VEHICLE_KM',
    'CAR_KM',
    'PERCENT',
    'GJ_PER_TON',
    'TON_KM_ROAD_PER_PERSON_YEAR',
    'KG_FLUID',
    'KWH_PER_HOME_YEAR',
    'KM_PER_PERSON_YEAR',
    'KGN_PER_HA',
    'KWH_PER_M2_YEAR',
    'GWH',
    'KG_FLUID_PER_KW_FRIDGE',
    'KG_FLUID_PER_m2',
    'KG_FLUID_PER_EQUIPMENT',
    'KG_FLUID_PER_STORAGE_M3',
    'KWH_PER_HOUSING_YEAR',
    'PERCENT_APPARTMENTS',
    'PERCENT_HOUSES',
    'DAY',
    'LITER_PER_HA',
    'MJ_PER_HA',
    'KWH_PER_PERSON_FLOOR_YEAR',
    'PLANT',
    'KG_PER_m3',
    'KGDBO',
    'KGDBO_PER_M3',
    'KG_H2_PER_100KM',
    'GO',
    'REQUEST',
    'MAIL',
    'KEURO_2019_HT',
    'KEURO_2020_HT',
    'KEURO_2021_HT',
    'KEURO_2022_HT',
    'KEURO_2023_HT',
    'EURO',
    'DOLLAR',
    'JPY',
    'CNY',
    'YEAR',
    'CUSTOM',
    'CAR',
    'KG_GAZOLINE_PER_KM',
    'KG_PER_KM',
    'KG_PER_CAR_KM',
    'KG_PER_KM_CAR',
    'KG_PER_KM_PASSENGER',
    'KG_PER_PASSENGER_KM',
    'KG_PER_TON_KM',
    'KM_PER_JOURNEY',
    'KNOTS',
    'KWH_ELEC_TON',
    'KWH_PER_KM',
    'KWH_PER_PASSENGER_KM',
    'KWH_THERM_TON',
    'KWH_PCI_TON',
    'KWH_PER_TON_KM',
    'LITER_PER_ERRAND_KM',
    'LITER_PER_KM',
    'LITER_PER_M3_KM',
    'LITER_PER_PASSENGER_KM',
    'LITER_PER_TON_KM',
    'MAX_TONNAGE',
    'PASSENGERS',
    'TON_GAZOLINE_PER_DAY',
    'TON_KM_PER_PERSON_YEAR',
    'KG_GAZOLINE_PER_TON_KM',
    'MOVIES',
    'PERSON',
    'TEAM',
    'TEU_KM',
    'EQUIPEMENT',
    'KW_PER_YEAR_ELECTRIC_POWER',
    'UNITLESS',
    'KG_N'
);


--
-- Name: UserSource; Type: TYPE; Schema: common; Owner: -
--

CREATE TYPE common."UserSource" AS ENUM (
    'CRON',
    'TUNISIE'
);


--
-- Name: UserStatus; Type: TYPE; Schema: common; Owner: -
--

CREATE TYPE common."UserStatus" AS ENUM (
    'IMPORTED',
    'PENDING_REQUEST',
    'VALIDATED',
    'ACTIVE'
);


--
-- Name: CampaignStatus; Type: TYPE; Schema: mip; Owner: -
--

CREATE TYPE mip."CampaignStatus" AS ENUM (
    'OPEN',
    'CLOSED'
);


--
-- Name: RoleMip; Type: TYPE; Schema: mip; Owner: -
--

CREATE TYPE mip."RoleMip" AS ENUM (
    'ADMIN',
    'SUPER_ADMIN',
    'COLLABORATOR'
);


--
-- Name: check_matching_source(); Type: FUNCTION; Schema: bilan_carbone; Owner: -
--

CREATE FUNCTION bilan_carbone.check_matching_source() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  real_source text;
BEGIN
  SELECT source::text
  INTO   real_source
  FROM   bilan_carbone.emission_factor_import_version
  WHERE  id = NEW.import_version_id;

  /* Si aucune version trouvée, la clé étrangère échouera d'elle-même.     */
  IF real_source IS NOT NULL AND real_source = NEW.source::text THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION
    'Mismatch: import_version_id % a la source %, alors que NEW.source = %',
    NEW.import_version_id, real_source, NEW.source;
END;
$$;


--
-- Name: enforce_email_lowercase(); Type: FUNCTION; Schema: bilan_carbone; Owner: -
--

CREATE FUNCTION bilan_carbone.enforce_email_lowercase() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.email IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.email IS DISTINCT FROM OLD.email) THEN
    NEW.email := lower(NEW.email);
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: validate_account_organization_version_env(); Type: FUNCTION; Schema: bilan_carbone; Owner: -
--

CREATE FUNCTION bilan_carbone.validate_account_organization_version_env() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.organization_version_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM bilan_carbone.organization_versions
    WHERE id = NEW.organization_version_id
      AND environment = NEW.environment
  ) THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'Account.environment (%) must match OrganizationVersion.environment (%) for orgVersionId %',
      NEW.environment,
      (SELECT environment FROM bilan_carbone.organization_versions WHERE id = NEW.organization_version_id),
      NEW.organization_version_id;
  END IF;
END;
$$;


--
-- Name: validate_study_site_id(); Type: FUNCTION; Schema: bilan_carbone; Owner: -
--

CREATE FUNCTION bilan_carbone.validate_study_site_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM bilan_carbone.study_sites
    WHERE id = NEW.study_site_id
      AND study_id = NEW.study_id
  ) THEN
    RETURN NEW;
  ELSE
    RAISE EXCEPTION 'study_site_id % does not belong to study_id %', NEW.study_site_id, NEW.study_id;
  END IF;
END;
$$;




--
-- Name: EngagementAction; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone."EngagementAction" (
    id text NOT NULL,
    name text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    steps text NOT NULL,
    phase bilan_carbone."EngagementPhase" NOT NULL,
    description text NOT NULL,
    study_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    targets text[] NOT NULL
);


--
-- Name: StudyComment; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone."StudyComment" (
    id text NOT NULL,
    comment text NOT NULL,
    status bilan_carbone."CommentStatus" NOT NULL,
    "validatedAt" timestamp(3) without time zone,
    validated_by_account_id text,
    author_account_id text NOT NULL,
    study_id text NOT NULL,
    sub_post bilan_carbone."SubPost",
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: _EngagementActionToStudySite; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone."_EngagementActionToStudySite" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: accounts; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.accounts (
    id text NOT NULL,
    imported_file_date timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL,
    organization_version_id text,
    role bilan_carbone."Role" NOT NULL,
    environment common."Environment" NOT NULL,
    status common."UserStatus" NOT NULL,
    feedback_date timestamp(3) without time zone,
    formation_end_date timestamp(3) without time zone,
    formation_name text,
    formation_start_date timestamp(3) without time zone
);


--
-- Name: action_indicators; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.action_indicators (
    id text NOT NULL,
    action_id text NOT NULL,
    type bilan_carbone.action_indicator_type NOT NULL,
    description text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: action_sites; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.action_sites (
    id text NOT NULL,
    action_id text NOT NULL,
    study_site_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: action_steps; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.action_steps (
    id text NOT NULL,
    action_id text NOT NULL,
    title text NOT NULL,
    "order" integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: action_subposts; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.action_subposts (
    id text NOT NULL,
    action_id text NOT NULL,
    "subPost" bilan_carbone."SubPost" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: action_tags; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.action_tags (
    id text NOT NULL,
    action_id text NOT NULL,
    study_tag_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: actions; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.actions (
    id text NOT NULL,
    title text NOT NULL,
    detailed_description text,
    potential_deduction bilan_carbone."ActionPotentialDeduction" NOT NULL,
    reduction_value_kg integer,
    reduction_start_year text,
    owner text,
    necessary_budget integer,
    necesssary_ressources text,
    facilitators_and_abstacles text,
    additional_information text,
    nature bilan_carbone."ActionNature"[],
    category bilan_carbone."ActionCategory"[],
    relevance bilan_carbone."ActionRelevance"[],
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reduction_end_year text,
    transition_plan_id text NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    priority integer,
    reduction_details text
);


--
-- Name: actualities; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.actualities (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL,
    text text NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    language text DEFAULT 'fr'::text NOT NULL
);


--
-- Name: cnc_versions; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.cnc_versions (
    id text NOT NULL,
    year integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: cncs; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.cncs (
    id text NOT NULL,
    region_cnc text,
    numero_auto text,
    nom text,
    adresse text,
    code_insee text,
    commune text,
    dep text,
    ecrans integer,
    fauteuils integer,
    semaines_activite integer,
    seances integer,
    entrees2023 integer,
    entrees2022 integer,
    evolution_entrees double precision,
    tranche_entrees text,
    genre text,
    multiplexe boolean,
    latitude double precision,
    longitude double precision,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    number_of_programmed_films integer DEFAULT 0 NOT NULL,
    cnc_version_id text,
    cnc_code text,
    entrees2024 integer
);


--
-- Name: contributors; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.contributors (
    study_id text NOT NULL,
    sub_post bilan_carbone."SubPost" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    account_id text NOT NULL
);


--
-- Name: deactivable_features_statuses; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.deactivable_features_statuses (
    id text NOT NULL,
    feature bilan_carbone."DeactivatableFeature" NOT NULL,
    active boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by_account text,
    deactivated_environments common."Environment"[] DEFAULT ARRAY[]::common."Environment"[],
    deactivated_sources common."UserSource"[] DEFAULT ARRAY[]::common."UserSource"[]
);


--
-- Name: documents; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.documents (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    bucket_e_tag text NOT NULL,
    bucket_key text NOT NULL,
    study_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    uploader_account_id text NOT NULL,
    document_category bilan_carbone."DocumentCategory"
);


--
-- Name: emission_factor_import_version; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.emission_factor_import_version (
    id text NOT NULL,
    source bilan_carbone."Import" NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    archived boolean DEFAULT false NOT NULL
);


--
-- Name: emission_factor_part_metadata; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.emission_factor_part_metadata (
    emission_post_id text NOT NULL,
    title text NOT NULL,
    language text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: emission_factor_parts; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.emission_factor_parts (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    emission_factor_id text NOT NULL,
    total_co2 double precision NOT NULL,
    co2f double precision,
    ch4f double precision,
    ch4b double precision,
    n2o double precision,
    co2b double precision,
    sf6 double precision,
    hfc double precision,
    pfc double precision,
    other_ges double precision,
    type bilan_carbone."EmissionFactorPartType" NOT NULL,
    old_bc_id text,
    imported_raw_csv text,
    override_raw_csv text
);


--
-- Name: emission_factor_versions; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.emission_factor_versions (
    emission_factor_id text NOT NULL,
    import_version_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: emission_factors; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.emission_factors (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    imported_from bilan_carbone."Import" NOT NULL,
    imported_id text,
    organization_id text,
    status bilan_carbone."EmissionFactorStatus" NOT NULL,
    source text,
    location text,
    reliability integer,
    technical_representativeness integer,
    geographic_representativeness integer,
    temporal_representativeness integer,
    completeness integer,
    total_co2 double precision NOT NULL,
    co2f double precision,
    ch4f double precision,
    ch4b double precision,
    n2o double precision,
    co2b double precision,
    sf6 double precision,
    hfc double precision,
    pfc double precision,
    other_ges double precision,
    unit common."Unit",
    sub_posts bilan_carbone."SubPost"[],
    old_bc_id text,
    "customUnit" text,
    is_monetary boolean NOT NULL,
    base bilan_carbone."EmissionFactorBase",
    imported_raw_csv text,
    override_raw_csv text
);


--
-- Name: emission_metadata; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.emission_metadata (
    language text NOT NULL,
    title text,
    attribute text,
    frontiere text,
    tag text,
    location text,
    comment text,
    emission_factor_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: emission_source_tag; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.emission_source_tag (
    tag_id text NOT NULL,
    emission_source_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: export_rules; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.export_rules (
    id text NOT NULL,
    export bilan_carbone."Export" NOT NULL,
    sub_post bilan_carbone."SubPost" NOT NULL,
    type bilan_carbone."EmissionFactorPartType",
    operated text,
    not_operated text,
    operated_procedeed text,
    operated_fugitive text,
    not_operated_supported text,
    not_operated_not_supported text,
    rented text,
    final_client text,
    held text,
    held_fugitive text,
    held_procedeed text,
    not_held_not_supported text,
    not_held_other text,
    not_held_simple_rent text,
    not_held_supported text,
    used_by_intermediary text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    held_cas text,
    operated_cas text
);


--
-- Name: external_studies; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.external_studies (
    id text NOT NULL,
    transition_plan_id text NOT NULL,
    name text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    total_co2_kg bigint NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: formations; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.formations (
    id text NOT NULL,
    name text NOT NULL,
    link text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: objective_sites; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.objective_sites (
    id text NOT NULL,
    objective_id text NOT NULL,
    study_site_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: objective_subposts; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.objective_subposts (
    id text NOT NULL,
    objective_id text NOT NULL,
    "subPost" bilan_carbone."SubPost" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: objective_tags; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.objective_tags (
    id text NOT NULL,
    objective_id text NOT NULL,
    study_tag_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: objectives; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.objectives (
    id text NOT NULL,
    trajectory_id text NOT NULL,
    target_year integer NOT NULL,
    reduction_rate double precision NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    start_year integer,
    name text DEFAULT ''::text
);


--
-- Name: opening_hours; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.opening_hours (
    id text NOT NULL,
    is_holiday boolean DEFAULT false NOT NULL,
    day bilan_carbone."DayOfWeek" NOT NULL,
    open_hour text,
    close_hour text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    study_site_id text NOT NULL
);


--
-- Name: organization_versions; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.organization_versions (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "organizationId" text NOT NULL,
    is_cr boolean DEFAULT false NOT NULL,
    onboarded boolean DEFAULT false NOT NULL,
    onboarder_id text,
    parent_id text,
    environment common."Environment" NOT NULL,
    activated_licence integer[] DEFAULT ARRAY[]::integer[]
);


--
-- Name: secten_info; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.secten_info (
    id text NOT NULL,
    year integer NOT NULL,
    energy integer NOT NULL,
    industry integer NOT NULL,
    waste integer NOT NULL,
    buildings integer NOT NULL,
    agriculture integer NOT NULL,
    transportation integer NOT NULL,
    total integer NOT NULL,
    version_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: secten_version; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.secten_version (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    year integer NOT NULL
);


--
-- Name: sites; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.sites (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text NOT NULL,
    organization_id text NOT NULL,
    ca double precision DEFAULT 0 NOT NULL,
    etp integer DEFAULT 0 NOT NULL,
    city text,
    postal_code text,
    old_bc_id text,
    "cncId" text,
    beneficiary_number integer DEFAULT 0 NOT NULL,
    volunteer_number integer DEFAULT 0 NOT NULL,
    establishment_id text,
    establishment_year text,
    address text,
    student_number integer,
    superficy double precision,
    academy text,
    establishment_type bilan_carbone."EstablishmentType",
    country bilan_carbone."Country"
);


--
-- Name: situations; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.situations (
    id text NOT NULL,
    situation jsonb NOT NULL,
    study_site_id text NOT NULL,
    publicodes_version text NOT NULL,
    model_version text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    list_layout_situations jsonb NOT NULL
);


--
-- Name: studies; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.studies (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_public boolean NOT NULL,
    level bilan_carbone."Level" NOT NULL,
    results_unit bilan_carbone."StudyResultUnit" DEFAULT 'T'::bilan_carbone."StudyResultUnit" NOT NULL,
    old_bc_id text,
    realization_end_date date,
    realization_start_date date,
    created_by_account_id text NOT NULL,
    organization_version_id text NOT NULL,
    simplified boolean DEFAULT false NOT NULL,
    sub_posts_config_version text
);


--
-- Name: study_emission_factor_versions; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.study_emission_factor_versions (
    id text NOT NULL,
    study_id text NOT NULL,
    import_version_id text NOT NULL,
    source bilan_carbone."Import" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: study_emission_sources; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.study_emission_sources (
    id text NOT NULL,
    study_id text NOT NULL,
    name text NOT NULL,
    comment text,
    completeness integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    geographic_representativeness integer,
    reliability integer,
    source text,
    technical_representativeness integer,
    temporal_representativeness integer,
    type bilan_carbone."EmissionSourceType",
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    validated boolean,
    value double precision,
    emission_factor_id text,
    caracterisation bilan_carbone."EmissionSourceCaracterisation",
    depreciation_period integer,
    recycled_part integer,
    study_site_id text NOT NULL,
    sub_post bilan_carbone."SubPost" NOT NULL,
    duration integer DEFAULT 20,
    hectare integer,
    fe_completeness integer,
    fe_geographic_representativeness integer,
    fe_reliability integer,
    fe_technical_representativeness integer,
    fe_temporal_representativeness integer,
    last_editor_account_id text,
    construction_year timestamp(3) without time zone,
    fe_comment text,
    CONSTRAINT recycled_part_range CHECK (((recycled_part >= 0) AND (recycled_part <= 100)))
);


--
-- Name: study_exports; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.study_exports (
    study_id text NOT NULL,
    control bilan_carbone."ControlMode" DEFAULT 'Operational'::bilan_carbone."ControlMode" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id text NOT NULL,
    types bilan_carbone."Export"[] DEFAULT ARRAY[]::bilan_carbone."Export"[]
);


--
-- Name: study_sites; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.study_sites (
    id text NOT NULL,
    study_id text NOT NULL,
    site_id text NOT NULL,
    etp integer NOT NULL,
    ca double precision NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "number_of_openDays" integer,
    number_of_sessions integer,
    number_of_tickets integer,
    distance_to_paris integer,
    beneficiary_number integer,
    volunteer_number integer,
    cnc_version_id text,
    student_number integer,
    superficy double precision,
    country bilan_carbone."Country"
);


--
-- Name: study_tag; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.study_tag (
    id text NOT NULL,
    name text NOT NULL,
    color text,
    family_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: study_tag_families; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.study_tag_families (
    id text NOT NULL,
    name text NOT NULL,
    study_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: study_templates; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.study_templates (
    id text NOT NULL,
    study_id text NOT NULL,
    environment common."Environment" NOT NULL,
    template bilan_carbone."DuplicableStudy" NOT NULL
);


--
-- Name: trajectories; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.trajectories (
    id text NOT NULL,
    transition_plan_id text NOT NULL,
    name text NOT NULL,
    description text,
    type bilan_carbone.trajectory_type NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reference_year integer,
    sector_percentages jsonb,
    is_default boolean DEFAULT false NOT NULL
);


--
-- Name: transition_plan_studies; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.transition_plan_studies (
    transition_plan_id text NOT NULL,
    study_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: transition_plans; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.transition_plans (
    id text NOT NULL,
    study_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    secten_version_id text
);


--
-- Name: user_application_settings; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.user_application_settings (
    id text NOT NULL,
    validated_emission_sources_only boolean DEFAULT true NOT NULL,
    ca_unit bilan_carbone."SiteCAUnit" DEFAULT 'K'::bilan_carbone."SiteCAUnit" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    account_id text
);


--
-- Name: user_checked_steps; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.user_checked_steps (
    id text NOT NULL,
    step bilan_carbone."UserChecklist" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    account_id text NOT NULL
);


--
-- Name: users_on_study; Type: TABLE; Schema: bilan_carbone; Owner: -
--

CREATE TABLE bilan_carbone.users_on_study (
    study_id text NOT NULL,
    role bilan_carbone."StudyRole" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    account_id text NOT NULL
);


--
-- Name: organizations; Type: TABLE; Schema: common; Owner: -
--

CREATE TABLE common.organizations (
    id text NOT NULL,
    name text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    imported_file_date timestamp(3) without time zone,
    old_bc_id text,
    wordpress_id text
);


--
-- Name: users; Type: TABLE; Schema: common; Owner: -
--

CREATE TABLE common.users (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text,
    reset_token text,
    level bilan_carbone."Level",
    source common."UserSource" DEFAULT 'CRON'::common."UserSource" NOT NULL,
    formation_form_start_time timestamp(3) without time zone
);


--
-- Name: accounts_mip; Type: TABLE; Schema: mip; Owner: -
--

CREATE TABLE mip.accounts_mip (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL,
    status common."UserStatus" NOT NULL,
    organization_version_mip_id text,
    environment common."Environment" DEFAULT 'MIP'::common."Environment" NOT NULL,
    role mip."RoleMip" NOT NULL
);


--
-- Name: accounts_on_campaign; Type: TABLE; Schema: mip; Owner: -
--

CREATE TABLE mip.accounts_on_campaign (
    stcampaignd text NOT NULL,
    account_mip_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: campaigns; Type: TABLE; Schema: mip; Owner: -
--

CREATE TABLE mip.campaigns (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    status mip."CampaignStatus" DEFAULT 'OPEN'::mip."CampaignStatus" NOT NULL,
    model_campaign_id text NOT NULL,
    created_by_account_mip_id text NOT NULL
);


--
-- Name: model_campaigns; Type: TABLE; Schema: mip; Owner: -
--

CREATE TABLE mip.model_campaigns (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    name text NOT NULL,
    model json NOT NULL
);


--
-- Name: organization_versions_mip; Type: TABLE; Schema: mip; Owner: -
--

CREATE TABLE mip.organization_versions_mip (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text NOT NULL,
    organization_id text NOT NULL,
    environment common."Environment" DEFAULT 'MIP'::common."Environment" NOT NULL,
    model_campaign_id text
);


--
-- Name: responses; Type: TABLE; Schema: mip; Owner: -
--

CREATE TABLE mip.responses (
    id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    campaign_id text NOT NULL,
    answers jsonb NOT NULL
);


--
-- Name: EngagementAction EngagementAction_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."EngagementAction"
    ADD CONSTRAINT "EngagementAction_pkey" PRIMARY KEY (id);


--
-- Name: StudyComment StudyComment_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."StudyComment"
    ADD CONSTRAINT "StudyComment_pkey" PRIMARY KEY (id);


--
-- Name: _EngagementActionToStudySite _EngagementActionToStudySite_AB_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."_EngagementActionToStudySite"
    ADD CONSTRAINT "_EngagementActionToStudySite_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: action_indicators action_indicators_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_indicators
    ADD CONSTRAINT action_indicators_pkey PRIMARY KEY (id);


--
-- Name: action_sites action_sites_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_sites
    ADD CONSTRAINT action_sites_pkey PRIMARY KEY (id);


--
-- Name: action_steps action_steps_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_steps
    ADD CONSTRAINT action_steps_pkey PRIMARY KEY (id);


--
-- Name: action_subposts action_subposts_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_subposts
    ADD CONSTRAINT action_subposts_pkey PRIMARY KEY (id);


--
-- Name: action_tags action_tags_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_tags
    ADD CONSTRAINT action_tags_pkey PRIMARY KEY (id);


--
-- Name: actions actions_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);


--
-- Name: actualities actualities_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.actualities
    ADD CONSTRAINT actualities_pkey PRIMARY KEY (id);


--
-- Name: cnc_versions cnc_versions_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.cnc_versions
    ADD CONSTRAINT cnc_versions_pkey PRIMARY KEY (id);


--
-- Name: cncs cncs_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.cncs
    ADD CONSTRAINT cncs_pkey PRIMARY KEY (id);


--
-- Name: contributors contributors_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.contributors
    ADD CONSTRAINT contributors_pkey PRIMARY KEY (study_id, account_id, sub_post);


--
-- Name: deactivable_features_statuses deactivable_features_statuses_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.deactivable_features_statuses
    ADD CONSTRAINT deactivable_features_statuses_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: emission_factor_import_version emission_factor_import_version_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factor_import_version
    ADD CONSTRAINT emission_factor_import_version_pkey PRIMARY KEY (id);


--
-- Name: emission_factor_part_metadata emission_factor_part_metadata_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factor_part_metadata
    ADD CONSTRAINT emission_factor_part_metadata_pkey PRIMARY KEY (emission_post_id, language);


--
-- Name: emission_factor_parts emission_factor_parts_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factor_parts
    ADD CONSTRAINT emission_factor_parts_pkey PRIMARY KEY (id);


--
-- Name: emission_factor_versions emission_factor_versions_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factor_versions
    ADD CONSTRAINT emission_factor_versions_pkey PRIMARY KEY (emission_factor_id, import_version_id);


--
-- Name: emission_factors emission_factors_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factors
    ADD CONSTRAINT emission_factors_pkey PRIMARY KEY (id);


--
-- Name: emission_metadata emission_metadata_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_metadata
    ADD CONSTRAINT emission_metadata_pkey PRIMARY KEY (emission_factor_id, language);


--
-- Name: emission_source_tag emission_source_tag_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_source_tag
    ADD CONSTRAINT emission_source_tag_pkey PRIMARY KEY (emission_source_id, tag_id);


--
-- Name: export_rules export_rules_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.export_rules
    ADD CONSTRAINT export_rules_pkey PRIMARY KEY (id);


--
-- Name: external_studies external_studies_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.external_studies
    ADD CONSTRAINT external_studies_pkey PRIMARY KEY (id);


--
-- Name: formations formations_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.formations
    ADD CONSTRAINT formations_pkey PRIMARY KEY (id);


--
-- Name: objective_sites objective_sites_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objective_sites
    ADD CONSTRAINT objective_sites_pkey PRIMARY KEY (id);


--
-- Name: objective_subposts objective_subposts_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objective_subposts
    ADD CONSTRAINT objective_subposts_pkey PRIMARY KEY (id);


--
-- Name: objective_tags objective_tags_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objective_tags
    ADD CONSTRAINT objective_tags_pkey PRIMARY KEY (id);


--
-- Name: objectives objectives_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objectives
    ADD CONSTRAINT objectives_pkey PRIMARY KEY (id);


--
-- Name: opening_hours opening_hours_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.opening_hours
    ADD CONSTRAINT opening_hours_pkey PRIMARY KEY (id);


--
-- Name: organization_versions organization_versions_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.organization_versions
    ADD CONSTRAINT organization_versions_pkey PRIMARY KEY (id);


--
-- Name: secten_info secten_info_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.secten_info
    ADD CONSTRAINT secten_info_pkey PRIMARY KEY (id);


--
-- Name: secten_version secten_version_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.secten_version
    ADD CONSTRAINT secten_version_pkey PRIMARY KEY (id);


--
-- Name: sites sites_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.sites
    ADD CONSTRAINT sites_pkey PRIMARY KEY (id);


--
-- Name: situations situations_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.situations
    ADD CONSTRAINT situations_pkey PRIMARY KEY (id);


--
-- Name: studies studies_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.studies
    ADD CONSTRAINT studies_pkey PRIMARY KEY (id);


--
-- Name: study_emission_factor_versions study_emission_factor_versions_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_emission_factor_versions
    ADD CONSTRAINT study_emission_factor_versions_pkey PRIMARY KEY (id);


--
-- Name: study_emission_sources study_emission_sources_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_emission_sources
    ADD CONSTRAINT study_emission_sources_pkey PRIMARY KEY (id);


--
-- Name: study_exports study_exports_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_exports
    ADD CONSTRAINT study_exports_pkey PRIMARY KEY (id);


--
-- Name: study_sites study_sites_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_sites
    ADD CONSTRAINT study_sites_pkey PRIMARY KEY (id);


--
-- Name: study_tag_families study_tag_families_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_tag_families
    ADD CONSTRAINT study_tag_families_pkey PRIMARY KEY (id);


--
-- Name: study_tag study_tag_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_tag
    ADD CONSTRAINT study_tag_pkey PRIMARY KEY (id);


--
-- Name: study_templates study_templates_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_templates
    ADD CONSTRAINT study_templates_pkey PRIMARY KEY (id);


--
-- Name: trajectories trajectories_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.trajectories
    ADD CONSTRAINT trajectories_pkey PRIMARY KEY (id);


--
-- Name: transition_plan_studies transition_plan_studies_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.transition_plan_studies
    ADD CONSTRAINT transition_plan_studies_pkey PRIMARY KEY (transition_plan_id, study_id);


--
-- Name: transition_plans transition_plans_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.transition_plans
    ADD CONSTRAINT transition_plans_pkey PRIMARY KEY (id);


--
-- Name: user_application_settings user_application_settings_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.user_application_settings
    ADD CONSTRAINT user_application_settings_pkey PRIMARY KEY (id);


--
-- Name: user_checked_steps user_checked_steps_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.user_checked_steps
    ADD CONSTRAINT user_checked_steps_pkey PRIMARY KEY (id);


--
-- Name: users_on_study users_on_study_pkey; Type: CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.users_on_study
    ADD CONSTRAINT users_on_study_pkey PRIMARY KEY (study_id, account_id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: common; Owner: -
--

ALTER TABLE ONLY common.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: common; Owner: -
--

ALTER TABLE ONLY common.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_mip accounts_mip_pkey; Type: CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.accounts_mip
    ADD CONSTRAINT accounts_mip_pkey PRIMARY KEY (id);


--
-- Name: accounts_on_campaign accounts_on_campaign_pkey; Type: CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.accounts_on_campaign
    ADD CONSTRAINT accounts_on_campaign_pkey PRIMARY KEY (stcampaignd, account_mip_id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: model_campaigns model_campaigns_pkey; Type: CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.model_campaigns
    ADD CONSTRAINT model_campaigns_pkey PRIMARY KEY (id);


--
-- Name: organization_versions_mip organization_versions_mip_pkey; Type: CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.organization_versions_mip
    ADD CONSTRAINT organization_versions_mip_pkey PRIMARY KEY (id);


--
-- Name: responses responses_pkey; Type: CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.responses
    ADD CONSTRAINT responses_pkey PRIMARY KEY (id);


--
-- Name: _EngagementActionToStudySite_B_index; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX "_EngagementActionToStudySite_B_index" ON bilan_carbone."_EngagementActionToStudySite" USING btree ("B");


--
-- Name: accounts_user_id_environment_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX accounts_user_id_environment_key ON bilan_carbone.accounts USING btree (user_id, environment);


--
-- Name: action_sites_action_id_study_site_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX action_sites_action_id_study_site_id_key ON bilan_carbone.action_sites USING btree (action_id, study_site_id);


--
-- Name: action_subposts_action_id_subPost_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX "action_subposts_action_id_subPost_key" ON bilan_carbone.action_subposts USING btree (action_id, "subPost");


--
-- Name: action_tags_action_id_study_tag_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX action_tags_action_id_study_tag_id_key ON bilan_carbone.action_tags USING btree (action_id, study_tag_id);


--
-- Name: cnc_versions_year_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX cnc_versions_year_key ON bilan_carbone.cnc_versions USING btree (year);


--
-- Name: cncs_cnc_code_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX cncs_cnc_code_key ON bilan_carbone.cncs USING btree (cnc_code);


--
-- Name: cncs_numero_auto_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX cncs_numero_auto_key ON bilan_carbone.cncs USING btree (numero_auto);


--
-- Name: deactivable_features_statuses_feature_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX deactivable_features_statuses_feature_key ON bilan_carbone.deactivable_features_statuses USING btree (feature);


--
-- Name: emission_factor_import_version_source_name_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX emission_factor_import_version_source_name_key ON bilan_carbone.emission_factor_import_version USING btree (source, name);


--
-- Name: emission_factor_versions_import_version_id_idx; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX emission_factor_versions_import_version_id_idx ON bilan_carbone.emission_factor_versions USING btree (import_version_id);


--
-- Name: emission_factors_organization_id_idx; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX emission_factors_organization_id_idx ON bilan_carbone.emission_factors USING btree (organization_id);


--
-- Name: emission_factors_status_idx; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX emission_factors_status_idx ON bilan_carbone.emission_factors USING btree (status);


--
-- Name: emission_metadata_language_title_idx; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX emission_metadata_language_title_idx ON bilan_carbone.emission_metadata USING btree (language, title);


--
-- Name: emission_source_tag_emission_source_id_idx; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX emission_source_tag_emission_source_id_idx ON bilan_carbone.emission_source_tag USING btree (emission_source_id);


--
-- Name: emission_source_tag_tag_id_idx; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX emission_source_tag_tag_id_idx ON bilan_carbone.emission_source_tag USING btree (tag_id);


--
-- Name: export_rules_export_sub_post_type_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX export_rules_export_sub_post_type_key ON bilan_carbone.export_rules USING btree (export, sub_post, type);


--
-- Name: formations_name_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX formations_name_key ON bilan_carbone.formations USING btree (name);


--
-- Name: objective_sites_objective_id_study_site_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX objective_sites_objective_id_study_site_id_key ON bilan_carbone.objective_sites USING btree (objective_id, study_site_id);


--
-- Name: objective_subposts_objective_id_subPost_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX "objective_subposts_objective_id_subPost_key" ON bilan_carbone.objective_subposts USING btree (objective_id, "subPost");


--
-- Name: objective_tags_objective_id_study_tag_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX objective_tags_objective_id_study_tag_id_key ON bilan_carbone.objective_tags USING btree (objective_id, study_tag_id);


--
-- Name: organization_versions_organizationId_environment_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX "organization_versions_organizationId_environment_key" ON bilan_carbone.organization_versions USING btree ("organizationId", environment);


--
-- Name: secten_info_version_id_idx; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX secten_info_version_id_idx ON bilan_carbone.secten_info USING btree (version_id);


--
-- Name: secten_info_version_id_year_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX secten_info_version_id_year_key ON bilan_carbone.secten_info USING btree (version_id, year);


--
-- Name: secten_info_year_idx; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE INDEX secten_info_year_idx ON bilan_carbone.secten_info USING btree (year);


--
-- Name: secten_version_year_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX secten_version_year_key ON bilan_carbone.secten_version USING btree (year);


--
-- Name: situations_study_site_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX situations_study_site_id_key ON bilan_carbone.situations USING btree (study_site_id);


--
-- Name: study_emission_factor_versions_study_id_source_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX study_emission_factor_versions_study_id_source_key ON bilan_carbone.study_emission_factor_versions USING btree (study_id, source);


--
-- Name: study_exports_study_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX study_exports_study_id_key ON bilan_carbone.study_exports USING btree (study_id);


--
-- Name: study_sites_study_id_site_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX study_sites_study_id_site_id_key ON bilan_carbone.study_sites USING btree (study_id, site_id);


--
-- Name: study_tag_families_name_study_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX study_tag_families_name_study_id_key ON bilan_carbone.study_tag_families USING btree (name, study_id);


--
-- Name: study_tag_name_family_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX study_tag_name_family_id_key ON bilan_carbone.study_tag USING btree (name, family_id);


--
-- Name: study_templates_environment_template_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX study_templates_environment_template_key ON bilan_carbone.study_templates USING btree (environment, template);


--
-- Name: transition_plans_study_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX transition_plans_study_id_key ON bilan_carbone.transition_plans USING btree (study_id);


--
-- Name: user_application_settings_account_id_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX user_application_settings_account_id_key ON bilan_carbone.user_application_settings USING btree (account_id);


--
-- Name: user_checked_steps_account_id_step_key; Type: INDEX; Schema: bilan_carbone; Owner: -
--

CREATE UNIQUE INDEX user_checked_steps_account_id_step_key ON bilan_carbone.user_checked_steps USING btree (account_id, step);


--
-- Name: users_email_key; Type: INDEX; Schema: common; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON common.users USING btree (email);


--
-- Name: accounts_mip_user_id_environment_key; Type: INDEX; Schema: mip; Owner: -
--

CREATE UNIQUE INDEX accounts_mip_user_id_environment_key ON mip.accounts_mip USING btree (user_id, environment);


--
-- Name: organization_versions_mip_model_campaign_id_key; Type: INDEX; Schema: mip; Owner: -
--

CREATE UNIQUE INDEX organization_versions_mip_model_campaign_id_key ON mip.organization_versions_mip USING btree (model_campaign_id);


--
-- Name: organization_versions_mip_organization_id_environment_key; Type: INDEX; Schema: mip; Owner: -
--

CREATE UNIQUE INDEX organization_versions_mip_organization_id_environment_key ON mip.organization_versions_mip USING btree (organization_id, environment);


--
-- Name: study_emission_factor_versions trg_check_matching_source; Type: TRIGGER; Schema: bilan_carbone; Owner: -
--

CREATE TRIGGER trg_check_matching_source BEFORE INSERT OR UPDATE ON bilan_carbone.study_emission_factor_versions FOR EACH ROW EXECUTE FUNCTION bilan_carbone.check_matching_source();


--
-- Name: accounts trg_validate_account_org_env; Type: TRIGGER; Schema: bilan_carbone; Owner: -
--

CREATE TRIGGER trg_validate_account_org_env BEFORE INSERT OR UPDATE ON bilan_carbone.accounts FOR EACH ROW EXECUTE FUNCTION bilan_carbone.validate_account_organization_version_env();


--
-- Name: study_emission_sources trg_validate_study_site; Type: TRIGGER; Schema: bilan_carbone; Owner: -
--

CREATE TRIGGER trg_validate_study_site BEFORE INSERT OR UPDATE ON bilan_carbone.study_emission_sources FOR EACH ROW EXECUTE FUNCTION bilan_carbone.validate_study_site_id();


--
-- Name: users lowercase_email_trigger; Type: TRIGGER; Schema: common; Owner: -
--

CREATE TRIGGER lowercase_email_trigger BEFORE INSERT OR UPDATE ON common.users FOR EACH ROW EXECUTE FUNCTION bilan_carbone.enforce_email_lowercase();


--
-- Name: EngagementAction EngagementAction_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."EngagementAction"
    ADD CONSTRAINT "EngagementAction_study_id_fkey" FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudyComment StudyComment_author_account_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."StudyComment"
    ADD CONSTRAINT "StudyComment_author_account_id_fkey" FOREIGN KEY (author_account_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudyComment StudyComment_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."StudyComment"
    ADD CONSTRAINT "StudyComment_study_id_fkey" FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudyComment StudyComment_validated_by_account_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."StudyComment"
    ADD CONSTRAINT "StudyComment_validated_by_account_id_fkey" FOREIGN KEY (validated_by_account_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _EngagementActionToStudySite _EngagementActionToStudySite_A_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."_EngagementActionToStudySite"
    ADD CONSTRAINT "_EngagementActionToStudySite_A_fkey" FOREIGN KEY ("A") REFERENCES bilan_carbone."EngagementAction"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _EngagementActionToStudySite _EngagementActionToStudySite_B_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone."_EngagementActionToStudySite"
    ADD CONSTRAINT "_EngagementActionToStudySite_B_fkey" FOREIGN KEY ("B") REFERENCES bilan_carbone.study_sites(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: accounts accounts_organization_version_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.accounts
    ADD CONSTRAINT accounts_organization_version_id_fkey FOREIGN KEY (organization_version_id) REFERENCES bilan_carbone.organization_versions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES common.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: action_indicators action_indicators_action_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_indicators
    ADD CONSTRAINT action_indicators_action_id_fkey FOREIGN KEY (action_id) REFERENCES bilan_carbone.actions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: action_sites action_sites_action_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_sites
    ADD CONSTRAINT action_sites_action_id_fkey FOREIGN KEY (action_id) REFERENCES bilan_carbone.actions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: action_sites action_sites_study_site_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_sites
    ADD CONSTRAINT action_sites_study_site_id_fkey FOREIGN KEY (study_site_id) REFERENCES bilan_carbone.study_sites(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: action_steps action_steps_action_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_steps
    ADD CONSTRAINT action_steps_action_id_fkey FOREIGN KEY (action_id) REFERENCES bilan_carbone.actions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: action_subposts action_subposts_action_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_subposts
    ADD CONSTRAINT action_subposts_action_id_fkey FOREIGN KEY (action_id) REFERENCES bilan_carbone.actions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: action_tags action_tags_action_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_tags
    ADD CONSTRAINT action_tags_action_id_fkey FOREIGN KEY (action_id) REFERENCES bilan_carbone.actions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: action_tags action_tags_study_tag_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.action_tags
    ADD CONSTRAINT action_tags_study_tag_id_fkey FOREIGN KEY (study_tag_id) REFERENCES bilan_carbone.study_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: actions actions_transition_plan_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.actions
    ADD CONSTRAINT actions_transition_plan_id_fkey FOREIGN KEY (transition_plan_id) REFERENCES bilan_carbone.transition_plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cncs cncs_cnc_version_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.cncs
    ADD CONSTRAINT cncs_cnc_version_id_fkey FOREIGN KEY (cnc_version_id) REFERENCES bilan_carbone.cnc_versions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contributors contributors_account_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.contributors
    ADD CONSTRAINT contributors_account_id_fkey FOREIGN KEY (account_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: contributors contributors_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.contributors
    ADD CONSTRAINT contributors_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: deactivable_features_statuses deactivable_features_statuses_updated_by_account_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.deactivable_features_statuses
    ADD CONSTRAINT deactivable_features_statuses_updated_by_account_fkey FOREIGN KEY (updated_by_account) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: documents documents_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.documents
    ADD CONSTRAINT documents_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: documents documents_uploader_account_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.documents
    ADD CONSTRAINT documents_uploader_account_id_fkey FOREIGN KEY (uploader_account_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: emission_factor_part_metadata emission_factor_part_metadata_emission_post_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factor_part_metadata
    ADD CONSTRAINT emission_factor_part_metadata_emission_post_id_fkey FOREIGN KEY (emission_post_id) REFERENCES bilan_carbone.emission_factor_parts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: emission_factor_parts emission_factor_parts_emission_factor_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factor_parts
    ADD CONSTRAINT emission_factor_parts_emission_factor_id_fkey FOREIGN KEY (emission_factor_id) REFERENCES bilan_carbone.emission_factors(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: emission_factor_versions emission_factor_versions_emission_factor_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factor_versions
    ADD CONSTRAINT emission_factor_versions_emission_factor_id_fkey FOREIGN KEY (emission_factor_id) REFERENCES bilan_carbone.emission_factors(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: emission_factor_versions emission_factor_versions_import_version_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factor_versions
    ADD CONSTRAINT emission_factor_versions_import_version_id_fkey FOREIGN KEY (import_version_id) REFERENCES bilan_carbone.emission_factor_import_version(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: emission_factors emission_factors_organization_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_factors
    ADD CONSTRAINT emission_factors_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES common.organizations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: emission_metadata emission_metadata_emission_factor_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_metadata
    ADD CONSTRAINT emission_metadata_emission_factor_id_fkey FOREIGN KEY (emission_factor_id) REFERENCES bilan_carbone.emission_factors(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: emission_source_tag emission_source_tag_emission_source_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_source_tag
    ADD CONSTRAINT emission_source_tag_emission_source_id_fkey FOREIGN KEY (emission_source_id) REFERENCES bilan_carbone.study_emission_sources(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: emission_source_tag emission_source_tag_tag_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.emission_source_tag
    ADD CONSTRAINT emission_source_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES bilan_carbone.study_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: external_studies external_studies_transition_plan_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.external_studies
    ADD CONSTRAINT external_studies_transition_plan_id_fkey FOREIGN KEY (transition_plan_id) REFERENCES bilan_carbone.transition_plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objective_sites objective_sites_objective_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objective_sites
    ADD CONSTRAINT objective_sites_objective_id_fkey FOREIGN KEY (objective_id) REFERENCES bilan_carbone.objectives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objective_sites objective_sites_study_site_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objective_sites
    ADD CONSTRAINT objective_sites_study_site_id_fkey FOREIGN KEY (study_site_id) REFERENCES bilan_carbone.study_sites(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objective_subposts objective_subposts_objective_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objective_subposts
    ADD CONSTRAINT objective_subposts_objective_id_fkey FOREIGN KEY (objective_id) REFERENCES bilan_carbone.objectives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objective_tags objective_tags_objective_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objective_tags
    ADD CONSTRAINT objective_tags_objective_id_fkey FOREIGN KEY (objective_id) REFERENCES bilan_carbone.objectives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objective_tags objective_tags_study_tag_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objective_tags
    ADD CONSTRAINT objective_tags_study_tag_id_fkey FOREIGN KEY (study_tag_id) REFERENCES bilan_carbone.study_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: objectives objectives_trajectory_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.objectives
    ADD CONSTRAINT objectives_trajectory_id_fkey FOREIGN KEY (trajectory_id) REFERENCES bilan_carbone.trajectories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: opening_hours opening_hours_study_site_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.opening_hours
    ADD CONSTRAINT opening_hours_study_site_id_fkey FOREIGN KEY (study_site_id) REFERENCES bilan_carbone.study_sites(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: organization_versions organization_versions_onboarder_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.organization_versions
    ADD CONSTRAINT organization_versions_onboarder_id_fkey FOREIGN KEY (onboarder_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: organization_versions organization_versions_organizationId_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.organization_versions
    ADD CONSTRAINT "organization_versions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES common.organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: organization_versions organization_versions_parent_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.organization_versions
    ADD CONSTRAINT organization_versions_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES bilan_carbone.organization_versions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: secten_info secten_info_version_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.secten_info
    ADD CONSTRAINT secten_info_version_id_fkey FOREIGN KEY (version_id) REFERENCES bilan_carbone.secten_version(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sites sites_cncId_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.sites
    ADD CONSTRAINT "sites_cncId_fkey" FOREIGN KEY ("cncId") REFERENCES bilan_carbone.cncs(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sites sites_organization_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.sites
    ADD CONSTRAINT sites_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES common.organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: situations situations_study_site_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.situations
    ADD CONSTRAINT situations_study_site_id_fkey FOREIGN KEY (study_site_id) REFERENCES bilan_carbone.study_sites(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: studies studies_created_by_account_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.studies
    ADD CONSTRAINT studies_created_by_account_id_fkey FOREIGN KEY (created_by_account_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: studies studies_organization_version_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.studies
    ADD CONSTRAINT studies_organization_version_id_fkey FOREIGN KEY (organization_version_id) REFERENCES bilan_carbone.organization_versions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_emission_factor_versions study_emission_factor_versions_import_version_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_emission_factor_versions
    ADD CONSTRAINT study_emission_factor_versions_import_version_id_fkey FOREIGN KEY (import_version_id) REFERENCES bilan_carbone.emission_factor_import_version(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_emission_factor_versions study_emission_factor_versions_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_emission_factor_versions
    ADD CONSTRAINT study_emission_factor_versions_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_emission_sources study_emission_sources_emission_factor_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_emission_sources
    ADD CONSTRAINT study_emission_sources_emission_factor_id_fkey FOREIGN KEY (emission_factor_id) REFERENCES bilan_carbone.emission_factors(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: study_emission_sources study_emission_sources_last_editor_account_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_emission_sources
    ADD CONSTRAINT study_emission_sources_last_editor_account_id_fkey FOREIGN KEY (last_editor_account_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: study_emission_sources study_emission_sources_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_emission_sources
    ADD CONSTRAINT study_emission_sources_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_emission_sources study_emission_sources_study_site_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_emission_sources
    ADD CONSTRAINT study_emission_sources_study_site_id_fkey FOREIGN KEY (study_site_id) REFERENCES bilan_carbone.study_sites(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_exports study_exports_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_exports
    ADD CONSTRAINT study_exports_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_sites study_sites_cnc_version_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_sites
    ADD CONSTRAINT study_sites_cnc_version_id_fkey FOREIGN KEY (cnc_version_id) REFERENCES bilan_carbone.cnc_versions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: study_sites study_sites_site_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_sites
    ADD CONSTRAINT study_sites_site_id_fkey FOREIGN KEY (site_id) REFERENCES bilan_carbone.sites(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_sites study_sites_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_sites
    ADD CONSTRAINT study_sites_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_tag_families study_tag_families_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_tag_families
    ADD CONSTRAINT study_tag_families_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_tag study_tag_family_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_tag
    ADD CONSTRAINT study_tag_family_id_fkey FOREIGN KEY (family_id) REFERENCES bilan_carbone.study_tag_families(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: study_templates study_templates_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.study_templates
    ADD CONSTRAINT study_templates_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: trajectories trajectories_transition_plan_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.trajectories
    ADD CONSTRAINT trajectories_transition_plan_id_fkey FOREIGN KEY (transition_plan_id) REFERENCES bilan_carbone.transition_plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transition_plan_studies transition_plan_studies_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.transition_plan_studies
    ADD CONSTRAINT transition_plan_studies_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transition_plan_studies transition_plan_studies_transition_plan_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.transition_plan_studies
    ADD CONSTRAINT transition_plan_studies_transition_plan_id_fkey FOREIGN KEY (transition_plan_id) REFERENCES bilan_carbone.transition_plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: transition_plans transition_plans_secten_version_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.transition_plans
    ADD CONSTRAINT transition_plans_secten_version_id_fkey FOREIGN KEY (secten_version_id) REFERENCES bilan_carbone.secten_version(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transition_plans transition_plans_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.transition_plans
    ADD CONSTRAINT transition_plans_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_application_settings user_application_settings_account_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.user_application_settings
    ADD CONSTRAINT user_application_settings_account_id_fkey FOREIGN KEY (account_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users_on_study users_on_study_account_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.users_on_study
    ADD CONSTRAINT users_on_study_account_id_fkey FOREIGN KEY (account_id) REFERENCES bilan_carbone.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users_on_study users_on_study_study_id_fkey; Type: FK CONSTRAINT; Schema: bilan_carbone; Owner: -
--

ALTER TABLE ONLY bilan_carbone.users_on_study
    ADD CONSTRAINT users_on_study_study_id_fkey FOREIGN KEY (study_id) REFERENCES bilan_carbone.studies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: accounts_mip accounts_mip_organization_version_mip_id_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.accounts_mip
    ADD CONSTRAINT accounts_mip_organization_version_mip_id_fkey FOREIGN KEY (organization_version_mip_id) REFERENCES mip.organization_versions_mip(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: accounts_mip accounts_mip_user_id_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.accounts_mip
    ADD CONSTRAINT accounts_mip_user_id_fkey FOREIGN KEY (user_id) REFERENCES common.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: accounts_on_campaign accounts_on_campaign_account_mip_id_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.accounts_on_campaign
    ADD CONSTRAINT accounts_on_campaign_account_mip_id_fkey FOREIGN KEY (account_mip_id) REFERENCES mip.accounts_mip(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: accounts_on_campaign accounts_on_campaign_stcampaignd_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.accounts_on_campaign
    ADD CONSTRAINT accounts_on_campaign_stcampaignd_fkey FOREIGN KEY (stcampaignd) REFERENCES mip.campaigns(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: campaigns campaigns_created_by_account_mip_id_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.campaigns
    ADD CONSTRAINT campaigns_created_by_account_mip_id_fkey FOREIGN KEY (created_by_account_mip_id) REFERENCES mip.accounts_mip(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: campaigns campaigns_model_campaign_id_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.campaigns
    ADD CONSTRAINT campaigns_model_campaign_id_fkey FOREIGN KEY (model_campaign_id) REFERENCES mip.model_campaigns(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: organization_versions_mip organization_versions_mip_model_campaign_id_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.organization_versions_mip
    ADD CONSTRAINT organization_versions_mip_model_campaign_id_fkey FOREIGN KEY (model_campaign_id) REFERENCES mip.model_campaigns(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: organization_versions_mip organization_versions_mip_organization_id_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.organization_versions_mip
    ADD CONSTRAINT organization_versions_mip_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES common.organizations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: responses responses_campaign_id_fkey; Type: FK CONSTRAINT; Schema: mip; Owner: -
--

ALTER TABLE ONLY mip.responses
    ADD CONSTRAINT responses_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES mip.campaigns(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

