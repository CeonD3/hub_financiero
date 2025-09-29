DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`lastname` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`email` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`password` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`image` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`sex` CHAR(1) NULL DEFAULT 'M' COLLATE 'utf8mb4_general_ci',
	`createdAt` DATETIME NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deletedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`host` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`description` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`status` INT(11) NULL DEFAULT '1',
	`createdAt` DATETIME NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deletedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`createdAt` DATETIME NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deletedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `user_company_profile`;
CREATE TABLE `user_company_profile` (
	`userId` INT(11) UNSIGNED NOT NULL,
	`companyId` INT(11) UNSIGNED NOT NULL,
	`profileId` INT(11) UNSIGNED NOT NULL,
	`createdAt` DATETIME NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deletedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`userId`, `companyId`, `profileId`)
);

DROP TABLE IF EXISTS `type_accounts`;
CREATE TABLE `type_accounts` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`status` INT(11) NULL DEFAULT '1',
	`masterId` INT(11) NULL DEFAULT '0',
	`createdAt` DATETIME NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deletedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
);

INSERT INTO `type_accounts` (`id`, `name`, `status`, `masterId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES (1, 'Zoom', 1, 1, '2023-03-17 12:51:20', '2023-03-17 13:34:01', NULL);
INSERT INTO `type_accounts` (`id`, `name`, `status`, `masterId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES (2, 'Google Drive', 1, 2, '2023-03-17 12:51:35', '2023-03-17 13:34:02', NULL);
INSERT INTO `type_accounts` (`id`, `name`, `status`, `masterId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES (3, 'Onedrive', 1, 2, '2023-03-17 12:51:44', '2023-03-17 13:34:03', NULL);

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`username` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`accessKey` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`secretKey` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`token` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`status` INT(11) NULL DEFAULT '1',
	`typeId` INT(11) NULL DEFAULT '0',
	`userId` INT(11) NULL DEFAULT '0',
	`companyId` INT(11) NULL DEFAULT '0',
	`createdAt` DATETIME NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deletedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `stacks`;
CREATE TABLE `stacks` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`userIdSender` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`accountIdSender` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`folderIdSender` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`fileIdSender` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',

	`accountIdReceiver` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`folderIdReceiver` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',

	`status` INT(11) NULL DEFAULT '1',
	`observation` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`parentId` INT(11) NULL DEFAULT '0',
	`typeId` INT(11) NULL DEFAULT '0',
	`repositoryId` INT(11) NULL DEFAULT '0',
	`userId` INT(11) NULL DEFAULT '0',
	`companyId` INT(11) NULL DEFAULT '0',

	`createdAt` DATETIME NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deletedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
);


CREATE TABLE `repositories` (
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`status` INT(11) NULL DEFAULT '1',
	`createdAt` DATETIME NULL DEFAULT current_timestamp(),
	`updatedAt` DATETIME NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	`deletedAt` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
);
