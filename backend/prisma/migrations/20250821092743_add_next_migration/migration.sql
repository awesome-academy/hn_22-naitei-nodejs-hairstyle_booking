/*
  Warnings:

  - You are about to drop the `salonstats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `BookingService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `salonstats` DROP FOREIGN KEY `SalonStats_salonId_fkey`;

-- AlterTable
ALTER TABLE `bookingservice` ADD COLUMN `price` INTEGER NOT NULL;

-- DropTable
DROP TABLE `salonstats`;

-- CreateTable
CREATE TABLE `SalonDailyStats` (
    `id` VARCHAR(191) NOT NULL,
    `salonId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `totalBookings` INTEGER NOT NULL DEFAULT 0,
    `completed` INTEGER NOT NULL DEFAULT 0,
    `cancelled` INTEGER NOT NULL DEFAULT 0,
    `cancelledEarly` INTEGER NOT NULL DEFAULT 0,
    `cancelledDayOff` INTEGER NOT NULL DEFAULT 0,
    `revenue` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SalonDailyStats_salonId_date_key`(`salonId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StylistDailyStats` (
    `id` VARCHAR(191) NOT NULL,
    `stylistId` VARCHAR(191) NOT NULL,
    `salonId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `totalBookings` INTEGER NOT NULL DEFAULT 0,
    `completed` INTEGER NOT NULL DEFAULT 0,
    `cancelled` INTEGER NOT NULL DEFAULT 0,
    `cancelledEarly` INTEGER NOT NULL DEFAULT 0,
    `cancelledDayOff` INTEGER NOT NULL DEFAULT 0,
    `revenue` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StylistDailyStats_stylistId_date_key`(`stylistId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceMonthlyStats` (
    `id` VARCHAR(191) NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `salonId` VARCHAR(191) NULL,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `usedCount` INTEGER NOT NULL,
    `isGlobal` BOOLEAN NOT NULL,

    UNIQUE INDEX `ServiceMonthlyStats_serviceId_salonId_year_month_key`(`serviceId`, `salonId`, `year`, `month`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SalonDailyStats` ADD CONSTRAINT `SalonDailyStats_salonId_fkey` FOREIGN KEY (`salonId`) REFERENCES `Salon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StylistDailyStats` ADD CONSTRAINT `StylistDailyStats_stylistId_fkey` FOREIGN KEY (`stylistId`) REFERENCES `Stylist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StylistDailyStats` ADD CONSTRAINT `StylistDailyStats_salonId_fkey` FOREIGN KEY (`salonId`) REFERENCES `Salon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceMonthlyStats` ADD CONSTRAINT `ServiceMonthlyStats_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceMonthlyStats` ADD CONSTRAINT `ServiceMonthlyStats_salonId_fkey` FOREIGN KEY (`salonId`) REFERENCES `Salon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
