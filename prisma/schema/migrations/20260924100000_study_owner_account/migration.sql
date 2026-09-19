-- AlterTable
ALTER TABLE `studies` MODIFY `organization_version_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `studies` ADD COLUMN `owner_account_id` VARCHAR(191) NULL;

UPDATE `studies` SET `owner_account_id` = `created_by_account_id` WHERE `owner_account_id` IS NULL;

ALTER TABLE `studies` MODIFY `owner_account_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `studies` ADD CONSTRAINT `studies_owner_account_id_fkey` FOREIGN KEY (`owner_account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `sites` MODIFY `organization_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `sites` ADD COLUMN `owner_account_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `sites` ADD CONSTRAINT `sites_owner_account_id_fkey` FOREIGN KEY (`owner_account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
