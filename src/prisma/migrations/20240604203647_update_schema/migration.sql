/*
  Warnings:

  - You are about to drop the column `image` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `emergency_contacts` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Itinerary` table. All the data in the column will be lost.
  - You are about to drop the column `claim_User_contact` on the `LostAndFound` table. All the data in the column will be lost.
  - You are about to drop the column `claim_User_name` on the `LostAndFound` table. All the data in the column will be lost.
  - You are about to drop the column `reporter_User_contact` on the `LostAndFound` table. All the data in the column will be lost.
  - You are about to drop the column `reporter_User_name` on the `LostAndFound` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Sponsor` table. All the data in the column will be lost.
  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image_url` to the `Advertisement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banner_link` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_link` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue_id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_link` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Itinerary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporter_user_id` to the `LostAndFound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Sponsor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue_id` to the `Sponsor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Shop` DROP FOREIGN KEY `Shop_event_id_fkey`;

-- DropForeignKey
ALTER TABLE `ShopPayment` DROP FOREIGN KEY `ShopPayment_shop_id_fkey`;

-- DropForeignKey
ALTER TABLE `Token_Transaction` DROP FOREIGN KEY `Token_Transaction_shop_ID_fkey`;

-- AlterTable
ALTER TABLE `Advertisement` DROP COLUMN `image`,
    ADD COLUMN `image_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Event` DROP COLUMN `emergency_contacts`,
    DROP COLUMN `images`,
    ADD COLUMN `banner_link` DATETIME(3) NOT NULL,
    ADD COLUMN `thumbnail_link` VARCHAR(191) NOT NULL,
    ADD COLUMN `venue_id` INTEGER NOT NULL,
    ADD COLUMN `video_link` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Itinerary` DROP COLUMN `images`,
    ADD COLUMN `image_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `LostAndFound` DROP COLUMN `claim_User_contact`,
    DROP COLUMN `claim_User_name`,
    DROP COLUMN `reporter_User_contact`,
    DROP COLUMN `reporter_User_name`,
    ADD COLUMN `reporter_user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `event_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Plan` DROP COLUMN `cost`,
    ADD COLUMN `payment` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Sponsor` DROP COLUMN `contact`,
    DROP COLUMN `image`,
    DROP COLUMN `level`,
    DROP COLUMN `name`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `end_time` VARCHAR(191) NOT NULL,
    ADD COLUMN `image_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `start_time` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `venue_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Shop`;

-- CreateTable
CREATE TABLE `Shops` (
    `shop_id` INTEGER NOT NULL AUTO_INCREMENT,
    `shop_name` VARCHAR(191) NOT NULL,
    `event_id` INTEGER NOT NULL,
    `shop_type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`shop_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Amenities` (
    `amenity_id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `latitude` DATETIME(3) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`amenity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` DATETIME(3) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Emergency_Contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_id` INTEGER NOT NULL,
    `contact_name` VARCHAR(191) NOT NULL,
    `contact_number` VARCHAR(191) NOT NULL,
    `contact_type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventToVenue` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EventToVenue_AB_unique`(`A`, `B`),
    INDEX `_EventToVenue_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LostAndFound` ADD CONSTRAINT `LostAndFound_claim_user_id_fkey` FOREIGN KEY (`claim_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LostAndFound` ADD CONSTRAINT `LostAndFound_reporter_user_id_fkey` FOREIGN KEY (`reporter_user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shops` ADD CONSTRAINT `Shops_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`event_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShopPayment` ADD CONSTRAINT `ShopPayment_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `Shops`(`shop_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token_Transaction` ADD CONSTRAINT `Token_Transaction_shop_ID_fkey` FOREIGN KEY (`shop_ID`) REFERENCES `Shops`(`shop_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Amenities` ADD CONSTRAINT `Amenities_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`event_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Emergency_Contacts` ADD CONSTRAINT `Emergency_Contacts_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Event`(`event_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventToVenue` ADD CONSTRAINT `_EventToVenue_A_fkey` FOREIGN KEY (`A`) REFERENCES `Event`(`event_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventToVenue` ADD CONSTRAINT `_EventToVenue_B_fkey` FOREIGN KEY (`B`) REFERENCES `Venue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
