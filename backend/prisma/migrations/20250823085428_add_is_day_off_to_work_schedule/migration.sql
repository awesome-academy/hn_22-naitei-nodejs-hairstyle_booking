/*
  Warnings:

  - The values [CANCELED] on the enum `Booking_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCELED] on the enum `DayOff_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - Added the required column `workScheduleId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `workScheduleId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED', 'CANCELLED_EARLY', 'CANCELLED_DAYOFF') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `dayoff` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `timeslot` MODIFY `isBooked` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`;

-- AlterTable
ALTER TABLE `workschedule` ADD COLUMN `isDayOff` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_workScheduleId_fkey` FOREIGN KEY (`workScheduleId`) REFERENCES `WorkSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
