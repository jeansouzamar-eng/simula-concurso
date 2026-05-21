-- AlterTable
ALTER TABLE `simulados` ADD COLUMN `concursoId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `concursos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `concursos_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `simulados` ADD CONSTRAINT `simulados_concursoId_fkey` FOREIGN KEY (`concursoId`) REFERENCES `concursos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
