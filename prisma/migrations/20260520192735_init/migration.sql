-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senhaHash` VARCHAR(191) NOT NULL,
    `tipo` ENUM('ALUNO', 'ADMIN') NOT NULL DEFAULT 'ALUNO',
    `plano` ENUM('GRATIS', 'PREMIUM') NOT NULL DEFAULT 'GRATIS',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materias` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `materias_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bancas` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bancas_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questoes` (
    `id` VARCHAR(191) NOT NULL,
    `enunciado` TEXT NOT NULL,
    `alternativaA` TEXT NOT NULL,
    `alternativaB` TEXT NOT NULL,
    `alternativaC` TEXT NOT NULL,
    `alternativaD` TEXT NOT NULL,
    `alternativaCorreta` VARCHAR(1) NOT NULL,
    `explicacao` TEXT NOT NULL,
    `dificuldade` ENUM('FACIL', 'MEDIA', 'DIFICIL') NOT NULL DEFAULT 'MEDIA',
    `materiaId` VARCHAR(191) NOT NULL,
    `bancaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulados` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NOT NULL,
    `tempoLimite` INTEGER NOT NULL,
    `nivel` ENUM('FACIL', 'INTERMEDIARIO', 'AVANCADO') NOT NULL DEFAULT 'INTERMEDIARIO',
    `quantidadeQuestoes` INTEGER NOT NULL,
    `materiaId` VARCHAR(191) NOT NULL,
    `bancaId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulado_questoes` (
    `id` VARCHAR(191) NOT NULL,
    `simuladoId` VARCHAR(191) NOT NULL,
    `questaoId` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,

    UNIQUE INDEX `simulado_questoes_simuladoId_questaoId_key`(`simuladoId`, `questaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resultados` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `simuladoId` VARCHAR(191) NOT NULL,
    `acertos` INTEGER NOT NULL,
    `erros` INTEGER NOT NULL,
    `percentual` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `respostas` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `questaoId` VARCHAR(191) NOT NULL,
    `resultadoId` VARCHAR(191) NOT NULL,
    `alternativa` VARCHAR(1) NOT NULL,
    `correta` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `questoes` ADD CONSTRAINT `questoes_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `materias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questoes` ADD CONSTRAINT `questoes_bancaId_fkey` FOREIGN KEY (`bancaId`) REFERENCES `bancas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `simulados` ADD CONSTRAINT `simulados_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `materias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `simulados` ADD CONSTRAINT `simulados_bancaId_fkey` FOREIGN KEY (`bancaId`) REFERENCES `bancas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `simulado_questoes` ADD CONSTRAINT `simulado_questoes_simuladoId_fkey` FOREIGN KEY (`simuladoId`) REFERENCES `simulados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `simulado_questoes` ADD CONSTRAINT `simulado_questoes_questaoId_fkey` FOREIGN KEY (`questaoId`) REFERENCES `questoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resultados` ADD CONSTRAINT `resultados_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resultados` ADD CONSTRAINT `resultados_simuladoId_fkey` FOREIGN KEY (`simuladoId`) REFERENCES `simulados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respostas` ADD CONSTRAINT `respostas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respostas` ADD CONSTRAINT `respostas_questaoId_fkey` FOREIGN KEY (`questaoId`) REFERENCES `questoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respostas` ADD CONSTRAINT `respostas_resultadoId_fkey` FOREIGN KEY (`resultadoId`) REFERENCES `resultados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
