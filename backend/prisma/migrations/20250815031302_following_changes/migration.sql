/*
  Warnings:

  - You are about to drop the `bookingcomplete` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `salonId` to the `DayOff` table without a default value. This is not possible if the table is not empty.
  - Made the column `fullName` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `bookingcomplete` DROP FOREIGN KEY `BookingComplete_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `bookingcomplete` DROP FOREIGN KEY `BookingComplete_customerId_fkey`;

-- AlterTable
ALTER TABLE `dayoff` ADD COLUMN `salonId` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `user` MODIFY `fullName` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `bookingcomplete`;

-- AddForeignKey
ALTER TABLE `DayOff` ADD CONSTRAINT `DayOff_salonId_fkey` FOREIGN KEY (`salonId`) REFERENCES `Salon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
