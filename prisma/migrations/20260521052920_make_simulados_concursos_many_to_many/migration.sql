-- CreateTable
CREATE TABLE `simulado_concursos` (
    `id` VARCHAR(191) NOT NULL,
    `simuladoId` VARCHAR(191) NOT NULL,
    `concursoId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `simulado_concursos_simuladoId_concursoId_key`(`simuladoId`, `concursoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Preserve existing one-to-one links before removing the old column.
INSERT INTO `simulado_concursos` (`id`, `simuladoId`, `concursoId`)
SELECT UUID(), `id`, `concursoId`
FROM `simulados`
WHERE `concursoId` IS NOT NULL;

-- DropForeignKey
ALTER TABLE `simulados` DROP FOREIGN KEY `simulados_concursoId_fkey`;

-- DropIndex
DROP INDEX `simulados_concursoId_fkey` ON `simulados`;

-- AlterTable
ALTER TABLE `simulados` DROP COLUMN `concursoId`;

-- AddForeignKey
ALTER TABLE `simulado_concursos` ADD CONSTRAINT `simulado_concursos_simuladoId_fkey` FOREIGN KEY (`simuladoId`) REFERENCES `simulados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `simulado_concursos` ADD CONSTRAINT `simulado_concursos_concursoId_fkey` FOREIGN KEY (`concursoId`) REFERENCES `concursos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
