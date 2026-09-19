-- CreateTable
CREATE TABLE `emission_factor_import_version` (
    `id` VARCHAR(191) NOT NULL,
    `source` ENUM('BaseEmpreinte', 'Legifrance', 'NegaOctet', 'Manual', 'CUT', 'CLICKSON', 'AIB', 'GIEC') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `emission_factor_import_version_source_name_key`(`source`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_factor_versions` (
    `emission_factor_id` VARCHAR(191) NOT NULL,
    `import_version_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `emission_factor_versions_import_version_id_idx`(`import_version_id`),
    PRIMARY KEY (`emission_factor_id`, `import_version_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_factors` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `old_bc_id` VARCHAR(191) NULL,
    `imported_from` ENUM('BaseEmpreinte', 'Legifrance', 'NegaOctet', 'Manual', 'CUT', 'CLICKSON', 'AIB', 'GIEC') NOT NULL,
    `imported_id` VARCHAR(191) NULL,
    `organization_id` VARCHAR(191) NULL,
    `base` ENUM('LocationBased', 'MarketBased') NULL,
    `status` ENUM('Archived', 'Valid') NOT NULL,
    `source` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `reliability` INTEGER NULL,
    `technical_representativeness` INTEGER NULL,
    `geographic_representativeness` INTEGER NULL,
    `temporal_representativeness` INTEGER NULL,
    `completeness` INTEGER NULL,
    `total_co2` DOUBLE NOT NULL,
    `co2f` DOUBLE NULL,
    `ch4f` DOUBLE NULL,
    `ch4b` DOUBLE NULL,
    `n2o` DOUBLE NULL,
    `co2b` DOUBLE NULL,
    `sf6` DOUBLE NULL,
    `hfc` DOUBLE NULL,
    `pfc` DOUBLE NULL,
    `other_ges` DOUBLE NULL,
    `unit` ENUM('A4_SHEET_100', 'KM_100', 'ACTIVE', 'APPAREL', 'RACE_KM', 'CAR', 'EURO_SPENT', 'EQUIPEMENT', 'FRANC_CFP', 'GJ_PCI', 'GJ_PCS', 'HA', 'HA_YEAR', 'HA_CLEMENTINE', 'HOUR', 'KEURO', 'KEURO_2019_HT', 'KEURO_2020_HT', 'KEURO_2021_HT', 'KEURO_2022_HT', 'KEURO_2023_HT', 'KG', 'KG_BIOGNC', 'KG_NITROGEN_SPREAD', 'KG_DCO_REMOVED', 'KG_BIOWASTE', 'KG_SOFT_WHEAT_15', 'KG_TREATED_LEATHER', 'KG_FABA_BEAN_15', 'KG_GREEN_COFFEE_BEANS_NO_PULP', 'KG_RAPESEED_9', 'KG_WOOL', 'KG_MILK', 'KG_CORN_28', 'KG_ACTIVE_MATERIAL', 'KG_RAW_MATERIAL', 'KG_RAW_MATERIAL_12', 'KG_RAW_MATERIAL_15', 'KG_RAW_MATERIAL_74', 'KG_RAW_MATERIAL_80', 'KG_RAW_MATERIAL_9', 'KG_RAW_MATERIAL_16_SUGAR', 'KG_RAW_MATERIAL_NO_PULP', 'KG_DRY_MATTER', 'KG_NET_WEIGHT', 'KG_GAZOLINE_PER_KM', 'KG_LIVE_WEIGHT', 'KG_LIVE_WEIGHT_CAT_0', 'KG_LIVE_WEIGHT_CAT_1', 'KG_LIVE_WEIGHT_CAT_2', 'KG_LIVE_WEIGHT_CAT_3', 'KG_SPRING_PEAS_15', 'KG_POTATO_80', 'KG_STARCH_POTATO_74', 'KG_TRITICALE_15', 'KG_NET_COMMERCIALLY_VIABLE_MEAT', 'KG_PASTURED_GRASS_80', 'KG_INGREDIENT_EXIT_STORE_NET_WEIGHT', 'KG_INGREDIENT_EXIT_STORE_NET_WEIGHT_GR', 'KG_INGREDIENT_EXIT_STORE_NET_WEIGHT_GRAINS', 'KG_INGESTED_INGREDIENT', 'KG_EGG', 'KG_EGG_CAT_0', 'KG_EGG_CAT_1', 'KG_EGG_CAT_2', 'KG_EGG_CAT_3', 'KG_BREWING_BARLEY_15', 'KG_FEED_BARLEY_15', 'KGH2', 'KG_MILK_LIQUID', 'KG_NTK', 'KG_PER_KM', 'KG_PER_CAR_KM', 'KG_PER_KM_CAR', 'KG_PER_KM_PASSENGER', 'KG_PER_PASSENGER_KM', 'KG_PER_TON_KM', 'KG_N', 'KM', 'KM_PERSON', 'KM_PER_JOURNEY', 'KNOTS', 'KWH', 'KWH_PCI', 'KWH_PCS', 'KWH_ELEC_TON', 'KWH_PER_KM', 'KWH_PER_PASSENGER_KM', 'KWH_THERM_TON', 'KWH_PCI_TON', 'KWH_PER_TON_KM', 'KW_PER_YEAR_ELECTRIC_POWER', 'LITER', 'LITER_LIQUID', 'LITER_PER_ERRAND_KM', 'LITER_PER_KM', 'LITER_PER_M3_KM', 'LITER_PER_PASSENGER_KM', 'LITER_PER_TON_KM', 'POUND', 'MAX_TONNAGE', 'METER', 'M2_SHON', 'M3', 'M3_KM', 'M3_N', 'METER_ROAD', 'MJ_PCI', 'ML', 'M2', 'M2_WALL', 'M2_FLOOR', 'M2_ROOF', 'PASSENGERS', 'PASSENGER_KM', 'PEQ_KM', 'PERSON_MONTH', 'UNIT_PIECE_SHRUB_POT', 'UNIT_PIECE_SHRUB_POT_3L', 'UNIT_PIECE_GRAFT', 'UNIT_PIECE_STEM', 'PORTION', 'MEAL', 'T', 'TEP', 'TEP_PCI', 'TEP_PCS', 'TEU_KM', 'TON_KM', 'TON', 'TON_WITH_BONES', 'TON_RAW', 'TON_COLLECTED', 'TON_CLINKER', 'TON_WASTE', 'TON_GAZOLINE_PER_DAY', 'TON_K2O', 'TON_DRY_MATTER', 'TON_N', 'TON_P2O5', 'TON_VIABLE_MEAT', 'TON_KM_PRODUCED', 'TON_PRODUCTED', 'TON_PROCESSED', 'UNIT', 'UNITLESS', 'IMPORTED_UNIT_PIECE_SHRUB_POT', 'VEHICLE_YEAR', 'VEHICLE_KM', 'CAR_KM', 'PERCENT', 'GJ_PER_TON', 'TON_KM_PER_PERSON_YEAR', 'TON_KM_ROAD_PER_PERSON_YEAR', 'KG_GAZOLINE_PER_TON_KM', 'KG_FLUID', 'KWH_PER_HOME_YEAR', 'KM_PER_PERSON_YEAR', 'KGN_PER_HA', 'KWH_PER_M2_YEAR', 'GWH', 'KG_FLUID_PER_KW_FRIDGE', 'KG_FLUID_PER_m2', 'KG_FLUID_PER_EQUIPMENT', 'KG_FLUID_PER_STORAGE_M3', 'KWH_PER_HOUSING_YEAR', 'PERCENT_APPARTMENTS', 'PERCENT_HOUSES', 'DAY', 'LITER_PER_HA', 'MJ_PER_HA', 'KWH_PER_PERSON_FLOOR_YEAR', 'PLANT', 'KG_PER_m3', 'KGDBO', 'KGDBO_PER_M3', 'KG_H2_PER_100KM', 'GO', 'REQUEST', 'MAIL', 'EURO', 'DOLLAR', 'JPY', 'CNY', 'YEAR', 'CUSTOM', 'MOVIES', 'PERSON', 'TEAM') NULL,
    `customUnit` VARCHAR(191) NULL,
    `is_monetary` BOOLEAN NOT NULL,
    `imported_raw_csv` LONGTEXT NULL,
    `override_raw_csv` LONGTEXT NULL,

    INDEX `emission_factors_organization_id_idx`(`organization_id`),
    INDEX `emission_factors_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_metadata` (
    `emission_factor_id` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `attribute` VARCHAR(191) NULL,
    `frontiere` VARCHAR(191) NULL,
    `tag` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `comment` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `emission_metadata_language_title_idx`(`language`, `title`),
    PRIMARY KEY (`emission_factor_id`, `language`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_factor_parts` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `old_bc_id` VARCHAR(191) NULL,
    `emission_factor_id` VARCHAR(191) NOT NULL,
    `type` ENUM('CarburantAmontCombustion', 'Amont', 'Intrants', 'Combustion', 'TransportEtDistribution', 'Energie', 'Fabrication', 'Traitement', 'Collecte', 'Autre', 'Amortissement', 'Incineration', 'EmissionsFugitives', 'Fuites', 'Transport', 'CombustionALaCentrale', 'Pertes', 'AutresEmissionsLieesALaConsommationDElectriciteBarrage') NOT NULL,
    `total_co2` DOUBLE NOT NULL,
    `co2f` DOUBLE NULL,
    `ch4f` DOUBLE NULL,
    `ch4b` DOUBLE NULL,
    `n2o` DOUBLE NULL,
    `co2b` DOUBLE NULL,
    `sf6` DOUBLE NULL,
    `hfc` DOUBLE NULL,
    `pfc` DOUBLE NULL,
    `other_ges` DOUBLE NULL,
    `imported_raw_csv` LONGTEXT NULL,
    `override_raw_csv` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_factor_sub_posts` (
    `emission_factor_id` VARCHAR(191) NOT NULL,
    `sub_post` ENUM('DeplacementsProfessionnels', 'Batiment', 'Equipe', 'Energie', 'ActivitesDeBureau', 'MobiliteSpectateurs', 'EquipesRecues', 'MaterielTechnique', 'AutreMateriel', 'Achats', 'Fret', 'Electromenager', 'DechetsOrdinaires', 'DechetsExceptionnels', 'MaterielDistributeurs', 'MaterielCinema', 'CommunicationDigitale', 'CaissesEtBornes') NOT NULL,

    PRIMARY KEY (`emission_factor_id`, `sub_post`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emission_factor_part_metadata` (
    `emission_post_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`emission_post_id`, `language`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_versions` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `organizationId` VARCHAR(191) NOT NULL,
    `is_cr` BOOLEAN NOT NULL DEFAULT false,
    `onboarded` BOOLEAN NOT NULL DEFAULT false,
    `onboarder_id` VARCHAR(191) NULL,
    `parent_id` VARCHAR(191) NULL,

    UNIQUE INDEX `organization_versions_organizationId_key`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sites` (
    `id` VARCHAR(191) NOT NULL,
    `old_bc_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `etp` INTEGER NOT NULL DEFAULT 0,
    `ca` DOUBLE NOT NULL DEFAULT 0,
    `postal_code` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `cncId` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cnc_versions` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cnc_versions_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cncs` (
    `id` VARCHAR(191) NOT NULL,
    `cnc_version_id` VARCHAR(191) NULL,
    `cnc_code` VARCHAR(191) NULL,
    `region_cnc` VARCHAR(191) NULL,
    `numero_auto` VARCHAR(191) NULL,
    `nom` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `code_insee` VARCHAR(191) NULL,
    `commune` VARCHAR(191) NULL,
    `dep` VARCHAR(191) NULL,
    `ecrans` INTEGER NULL,
    `fauteuils` INTEGER NULL,
    `semaines_activite` INTEGER NULL,
    `seances` INTEGER NULL,
    `entrees2024` INTEGER NULL,
    `entrees2023` INTEGER NULL,
    `entrees2022` INTEGER NULL,
    `evolution_entrees` DOUBLE NULL,
    `tranche_entrees` VARCHAR(191) NULL,
    `genre` VARCHAR(191) NULL,
    `multiplexe` BOOLEAN NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `number_of_programmed_films` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cncs_cnc_code_key`(`cnc_code`),
    UNIQUE INDEX `cncs_numero_auto_key`(`numero_auto`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organizations` (
    `id` VARCHAR(191) NOT NULL,
    `old_bc_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imported_file_date` DATETIME(3) NULL,
    `name` VARCHAR(191) NOT NULL,
    `wordpress_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situations` (
    `id` VARCHAR(191) NOT NULL,
    `situation` JSON NOT NULL,
    `list_layout_situations` JSON NOT NULL,
    `study_site_id` VARCHAR(191) NOT NULL,
    `publicodes_version` VARCHAR(191) NOT NULL,
    `model_version` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `situations_study_site_id_key`(`study_site_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opening_hours` (
    `id` VARCHAR(191) NOT NULL,
    `study_site_id` VARCHAR(191) NOT NULL,
    `is_holiday` BOOLEAN NOT NULL DEFAULT false,
    `day` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    `open_hour` VARCHAR(191) NULL,
    `close_hour` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studies` (
    `id` VARCHAR(191) NOT NULL,
    `old_bc_id` VARCHAR(191) NULL,
    `created_by_account_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `is_public` BOOLEAN NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `realization_start_date` DATE NULL,
    `realization_end_date` DATE NULL,
    `level` ENUM('Initial', 'Standard', 'Advanced') NOT NULL,
    `simplified` BOOLEAN NOT NULL DEFAULT true,
    `sub_posts_config_version` VARCHAR(191) NULL,
    `results_unit` ENUM('K', 'T') NOT NULL DEFAULT 'T',
    `organization_version_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_on_study` (
    `study_id` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,
    `role` ENUM('Validator', 'Editor', 'Reader') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`study_id`, `account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `study_emission_factor_versions` (
    `id` VARCHAR(191) NOT NULL,
    `study_id` VARCHAR(191) NOT NULL,
    `import_version_id` VARCHAR(191) NOT NULL,
    `source` ENUM('BaseEmpreinte', 'Legifrance', 'NegaOctet', 'Manual', 'CUT', 'CLICKSON', 'AIB', 'GIEC') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `study_emission_factor_versions_study_id_source_key`(`study_id`, `source`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `study_sites` (
    `id` VARCHAR(191) NOT NULL,
    `study_id` VARCHAR(191) NOT NULL,
    `site_id` VARCHAR(191) NOT NULL,
    `cnc_version_id` VARCHAR(191) NULL,
    `etp` INTEGER NOT NULL,
    `ca` DOUBLE NOT NULL,
    `number_of_sessions` INTEGER NULL,
    `number_of_tickets` INTEGER NULL,
    `number_of_openDays` INTEGER NULL,
    `distance_to_paris` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `study_sites_study_id_site_id_key`(`study_id`, `site_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,
    `imported_file_date` DATETIME(3) NULL,
    `organization_version_id` VARCHAR(191) NULL,
    `feedback_date` DATETIME(3) NULL,
    `role` ENUM('ADMIN', 'DEFAULT') NOT NULL,
    `status` ENUM('IMPORTED', 'PENDING_REQUEST', 'VALIDATED', 'ACTIVE') NOT NULL,

    UNIQUE INDEX `accounts_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_application_settings` (
    `id` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NULL,
    `validated_emission_sources_only` BOOLEAN NOT NULL DEFAULT true,
    `ca_unit` ENUM('U', 'K', 'M') NOT NULL DEFAULT 'K',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_application_settings_account_id_key`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `level` ENUM('Initial', 'Standard', 'Advanced') NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `reset_token` VARCHAR(191) NULL,
    `source` ENUM('CRON', 'TUNISIE') NOT NULL DEFAULT 'CRON',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emission_factor_versions` ADD CONSTRAINT `emission_factor_versions_emission_factor_id_fkey` FOREIGN KEY (`emission_factor_id`) REFERENCES `emission_factors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emission_factor_versions` ADD CONSTRAINT `emission_factor_versions_import_version_id_fkey` FOREIGN KEY (`import_version_id`) REFERENCES `emission_factor_import_version`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emission_factors` ADD CONSTRAINT `emission_factors_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emission_metadata` ADD CONSTRAINT `emission_metadata_emission_factor_id_fkey` FOREIGN KEY (`emission_factor_id`) REFERENCES `emission_factors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emission_factor_parts` ADD CONSTRAINT `emission_factor_parts_emission_factor_id_fkey` FOREIGN KEY (`emission_factor_id`) REFERENCES `emission_factors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emission_factor_sub_posts` ADD CONSTRAINT `emission_factor_sub_posts_emission_factor_id_fkey` FOREIGN KEY (`emission_factor_id`) REFERENCES `emission_factors`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emission_factor_part_metadata` ADD CONSTRAINT `emission_factor_part_metadata_emission_post_id_fkey` FOREIGN KEY (`emission_post_id`) REFERENCES `emission_factor_parts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_versions` ADD CONSTRAINT `organization_versions_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_versions` ADD CONSTRAINT `organization_versions_onboarder_id_fkey` FOREIGN KEY (`onboarder_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_versions` ADD CONSTRAINT `organization_versions_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `organization_versions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sites` ADD CONSTRAINT `sites_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sites` ADD CONSTRAINT `sites_cncId_fkey` FOREIGN KEY (`cncId`) REFERENCES `cncs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cncs` ADD CONSTRAINT `cncs_cnc_version_id_fkey` FOREIGN KEY (`cnc_version_id`) REFERENCES `cnc_versions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `situations` ADD CONSTRAINT `situations_study_site_id_fkey` FOREIGN KEY (`study_site_id`) REFERENCES `study_sites`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opening_hours` ADD CONSTRAINT `opening_hours_study_site_id_fkey` FOREIGN KEY (`study_site_id`) REFERENCES `study_sites`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studies` ADD CONSTRAINT `studies_created_by_account_id_fkey` FOREIGN KEY (`created_by_account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studies` ADD CONSTRAINT `studies_organization_version_id_fkey` FOREIGN KEY (`organization_version_id`) REFERENCES `organization_versions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_on_study` ADD CONSTRAINT `users_on_study_study_id_fkey` FOREIGN KEY (`study_id`) REFERENCES `studies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_on_study` ADD CONSTRAINT `users_on_study_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `study_emission_factor_versions` ADD CONSTRAINT `study_emission_factor_versions_study_id_fkey` FOREIGN KEY (`study_id`) REFERENCES `studies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `study_emission_factor_versions` ADD CONSTRAINT `study_emission_factor_versions_import_version_id_fkey` FOREIGN KEY (`import_version_id`) REFERENCES `emission_factor_import_version`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `study_sites` ADD CONSTRAINT `study_sites_study_id_fkey` FOREIGN KEY (`study_id`) REFERENCES `studies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `study_sites` ADD CONSTRAINT `study_sites_site_id_fkey` FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `study_sites` ADD CONSTRAINT `study_sites_cnc_version_id_fkey` FOREIGN KEY (`cnc_version_id`) REFERENCES `cnc_versions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_organization_version_id_fkey` FOREIGN KEY (`organization_version_id`) REFERENCES `organization_versions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_application_settings` ADD CONSTRAINT `user_application_settings_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
