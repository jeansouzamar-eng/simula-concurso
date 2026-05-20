-- AlterTable
ALTER TABLE `simulados` ADD COLUMN `isPremium` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `mercadoPagoPaymentId` VARCHAR(191) NULL,
    ADD COLUMN `premiumAt` DATETIME(3) NULL;
