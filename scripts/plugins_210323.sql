-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.21-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla db_margarita_plugins.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `accessKey` text DEFAULT NULL,
  `secretKey` text DEFAULT NULL,
  `token` text DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `repositoryId` int(11) DEFAULT 0,
  `userId` int(11) DEFAULT 0,
  `companyId` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla db_margarita_plugins.accounts: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`id`, `name`, `accessKey`, `secretKey`, `token`, `status`, `repositoryId`, `userId`, `companyId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 'zomma2', '8eMS-y76QPmwOOt1iVvVQg', '1MJkrY77BhmudvqVIOGXliEN9un5AKiPDU0C', NULL, 1, 1, 1, 1, '2023-03-17 13:44:24', '2023-03-17 13:45:31', NULL),
	(2, 'gtgtgtr', 'nrh8W5WoQnC4TcIsSb30PQ', 'u8j4B5btZXXKbymCcQXwh7ys3HL8bJZP10b4', NULL, 1, 1, 1, 1, '2023-03-17 16:40:06', '2023-03-17 16:40:06', NULL),
	(3, '1679213998', NULL, NULL, '{"token_type":"Bearer","scope":"openid profile email Files.Read Files.Read.All Files.ReadWrite Files.ReadWrite.All https:\\/\\/graph.microsoft.com\\/User.Read","ext_expires_in":3600,"access_token":"EwB4A8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAARg8MeQMCk4cNYxca3ts\\/wagxBJYVo2F22vKhzIA9nc\\/AH6UQK015qxbTSCAcMjO3S4qu5DdQqgR\\/dMo0cJBw6RnQ2NjyglnjrMOUucNcXZZn4IMl0WrvJ7nj8o5vnV8O+oCZ2lXXLx4sZsnPcf8OrM7ExoXl1PPAAKuZdE7cGY2mMjubvdnKQP4O\\/5t\\/vGUCVYZUthGvYESJoGdF9uwAJJw8gKZT9CnO1itW4phjIV7RCcifsaVDvbBh3OV3\\/nyE1WbLmePKWlBytDfq56jjoEQZ55MdPV70RAIJPhThkiOHw5a4UEuE0Ezfg+XKFkwsAUBu1Y31bVjb7YmCwZOkZkDZgAACIaohwSFWDshSAJ4fLmtZN026d7XlbD57X5RI02to8tVFRUNh3+k2K6gCNfnOAWvqnnITuqmWIQpLfseH8rO6nTSGxr05MLJyLSjJmhsyAAXkzUpDERuemz1Bx2NEMNXyv7awkgX69D9sLK5vHfIAZSGDDi3vY0+Gt\\/jkKUgzqeBlMwIsTi4liEtIvlYb7yHVYe9HdGHvQigyzBfFBo0v5u44x3oDrR9xm9xz1Mq8RwWZN0NqsJNCjrMRB4FLjqoZJmRm0Ihqg7YAKaLwVXh04YxH9rrtYzLNsP0q\\/c\\/FJj+eECccnOZMMdr6Ws4Or0QMOirQZOmWDJ\\/+RbJozUYwS24lsq1JIaAfM6Joi21ffHYJ7D4gRzeVHMgBGnXjInecxhEv2r2jx6nzgQ9SjMw8iHs63BGA9rfTFh8b2H9BiUoH0Rb86Fe+PFEqK6KETFrPMTs7FIq7AUikliimRjevOkq8We5SOC+fTw6m1SnSW8yhrzQYTaLoXkQuamdU+DyIiGgAfDLdzGLq00xNsVXXvETJrBHIo+jzJsNMjSTvR7qw7LPZTh\\/Sq\\/C3X8dimpzvb6vO+gA71l4SfVwb9AJianVLYzkZJ2inY4BzIiE+h79ErGHsW6SHVjWf4mVITAY5X6Rn5FVNSgargDyDEOFCC\\/j0WT8F\\/L1QchjsSrfosrN\\/2ywgO536+s5LN8YdWd9TLngLi+CiDJ\\/LunohLs75xbPAuxLHw97ECeVszFiTzSXQhVsYLsiYg47RPxTZcm5se8Tke+mcX+PVnaodQp1V37CaokC","refresh_token":"M.R3_SN1.-CbMbbH2Mruka*zHzf7DX4FyCuCWXW!UdXH6Fi3w2ilsQJLU0ueB0sj6khnHtuin7oxNfUJU8Z!TzDLwVFx57pbfrvm4VMOLXdKNBZUViY5zA7Z7u8XUvQgLj*h2QRfEApR2pkpDKb0YsITMWO!dd8ZHsv52LsY*brjNV7OzltgYrKZFoS9ti3GEk6xqEQmGzCO!3I7wEpxoB!DpmBTvJk2t2aY7Wjjv*e!uxDDo7DzvF1rl731kU5k4vz50IXqFfM28op6wG6hlBmOvaR1gJ0oWtp4JM*BYk1342GFMpDJUK!cjmRmYbXJK367b0XuzTROtDkeWu3RIJKIqdPU07lKRzjuhSlCu86D8b0gGsQo9ZQf*Ca7AIYDkPxlKWiCV!6psLoZh!1pM3GDuOsPR7mgUMKpUg1joEe5*TJi!MazJF","expires":1679217598,"id_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImJXOFpjTWpCQ25KWlMtaWJYNVVRRE5TdHZ4NCJ9.eyJ2ZXIiOiIyLjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vOTE4ODA0MGQtNmM2Ny00YzViLWIxMTItMzZhMzA0YjY2ZGFkL3YyLjAiLCJzdWIiOiJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBTWYwVm54RkFtcUdLQW5lcjlVNXVjIiwiYXVkIjoiZWM4NDdhYzctNTljZS00MGI3LWIxYmEtZGE2YzRjZmI5Njg4IiwiZXhwIjoxNjc5MzAwMzk3LCJpYXQiOjE2NzkyMTM2OTcsIm5iZiI6MTY3OTIxMzY5NywibmFtZSI6Ikpvc2UgTWFtYW5pIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiam9zZWFudF8xMjk0QGhvdG1haWwuY29tIiwib2lkIjoiMDAwMDAwMDAtMDAwMC0wMDAwLWViZGMtYTg0MWFhODI0NWZkIiwiZW1haWwiOiJqb3NlYW50XzEyOTRAaG90bWFpbC5jb20iLCJ0aWQiOiI5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJhaW8iOiJEUk9KbDlzOWwhY1ZDYzNBd3poUCo2WXIxZlQ0cVJLUjJYKml0dGEqa1Z3eWxETGViRmt2T1d4Q29DZjVtOEhTTHl2Rjlwa1ZleFA2ZUJwMHFOU0s3bXh6dmpVM0VqRlEyYyp1N1c4VDdTTWpvZDlFYnppR2NUTUxuIUtLdmJLQkdaeWdqOHZvZjNGZTZ6cEFLNkMyblNZJCJ9.TiUJjeXkqA2-M4vdWz9d0LJBbfNjkZrQaO2wdqwPv3pk8iNlIAdsOjewO4NSNBZXfqx5-KP1FnB7euKdNhhdRVCS5gv_sCDD2BqdiRjbfI_zr1RiSysMSh7rW4gvZu19Ht3TJkC2SB87wUj_ZCYkLtwxdP98iUlLmNaYBUdNX508FWhWpnCQQU0gVstU5MEkjDfON4GQiip7dMAC8tXGDJkx0OJSNuJPGj4setjbxFYM0PF4FIihlwsGDe6Wh7W8I9IX9mw5k3ogh9enUpaDU2MUI4ZEflDHYh28RrWXD917O5nyTUFJ2zJOw5i5HvMUV3SGznJZDT21ByqvXfKV4g"}', 1, 3, 1, 1, '2023-03-19 03:19:58', '2023-03-19 03:19:58', NULL),
	(4, 'test', 'aaaa', 'dddd', NULL, 1, 1, 1, 1, '2023-03-21 11:38:48', '2023-03-21 11:47:25', NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

-- Volcando estructura para tabla db_margarita_plugins.companies
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `host` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla db_margarita_plugins.companies: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` (`id`, `host`, `name`, `description`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 'localhost:8085', NULL, NULL, 1, '2023-03-16 18:52:01', '2023-03-16 18:52:07', NULL);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;

-- Volcando estructura para tabla db_margarita_plugins.profiles
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla db_margarita_plugins.profiles: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 'Master', '2023-03-16 18:52:38', '2023-03-16 18:52:38', NULL),
	(2, 'Administrador', '2023-03-16 18:52:46', '2023-03-16 18:52:46', NULL);
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;

-- Volcando estructura para tabla db_margarita_plugins.repositories
CREATE TABLE IF NOT EXISTS `repositories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `typeId` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla db_margarita_plugins.repositories: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `repositories` DISABLE KEYS */;
INSERT INTO `repositories` (`id`, `name`, `status`, `typeId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 'Zoom', 1, 0, '2023-03-17 12:51:20', '2023-03-20 14:37:33', NULL),
	(2, 'Google Drive', 0, 0, '2023-03-17 12:51:35', '2023-03-21 15:14:56', NULL),
	(3, 'Onedrive', 1, 0, '2023-03-17 12:51:44', '2023-03-20 14:37:39', NULL);
/*!40000 ALTER TABLE `repositories` ENABLE KEYS */;

-- Volcando estructura para tabla db_margarita_plugins.stacks
CREATE TABLE IF NOT EXISTS `stacks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userIdSender` varchar(255) DEFAULT NULL,
  `accountIdSender` int(11) DEFAULT 0,
  `folderIdSender` varchar(255) DEFAULT NULL,
  `fileIdSender` varchar(255) DEFAULT NULL,
  `accountIdReceiver` int(11) DEFAULT 0,
  `folderIdReceiver` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `userId` int(11) DEFAULT 0,
  `companyId` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla db_margarita_plugins.stacks: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `stacks` DISABLE KEYS */;
INSERT INTO `stacks` (`id`, `userIdSender`, `accountIdSender`, `folderIdSender`, `fileIdSender`, `accountIdReceiver`, `folderIdReceiver`, `status`, `userId`, `companyId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 'kkwlRrUzTxC5qH3gwsUGoQ', 2, '83587855048', NULL, 3, 'EBDCA841AA8245FD!3401', 2, 1, 1, '2023-03-20 23:50:39', '2023-03-21 03:57:19', NULL);
/*!40000 ALTER TABLE `stacks` ENABLE KEYS */;

-- Volcando estructura para tabla db_margarita_plugins.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sex` char(1) DEFAULT 'M',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla db_margarita_plugins.users: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `lastname`, `email`, `password`, `image`, `sex`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 'Jose', 'Mamani', 'jmamani@softdynamic.org', '$2y$10$El7E9ftWW1/PN3ImvpdczO/pMgk4L8.mCsx83oYnrjKWkLP6QLNs6', NULL, 'M', '2023-03-16 18:53:07', '2023-03-17 11:04:10', NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Volcando estructura para tabla db_margarita_plugins.user_company_profile
CREATE TABLE IF NOT EXISTS `user_company_profile` (
  `userId` int(11) unsigned NOT NULL,
  `companyId` int(11) unsigned NOT NULL,
  `profileId` int(11) unsigned NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`,`companyId`,`profileId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla db_margarita_plugins.user_company_profile: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `user_company_profile` DISABLE KEYS */;
INSERT INTO `user_company_profile` (`userId`, `companyId`, `profileId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
	(1, 1, 1, '2023-03-17 11:00:42', '2023-03-17 11:00:42', NULL);
/*!40000 ALTER TABLE `user_company_profile` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
