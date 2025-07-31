/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropIndex
DROP INDEX `User_role_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `salon` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `date_of_birth`,
    DROP COLUMN `full_name`,
    DROP COLUMN `role_id`,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `fullName` VARCHAR(191) NULL,
    ADD COLUMN `roleId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
