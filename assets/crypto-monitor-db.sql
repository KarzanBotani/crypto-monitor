-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.20-0ubuntu0.16.04.1 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for crypto_monitor
DROP DATABASE IF EXISTS `crypto_monitor`;
CREATE DATABASE IF NOT EXISTS `crypto_monitor` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `crypto_monitor`;

-- Dumping structure for table crypto_monitor.currencies
DROP TABLE IF EXISTS `currencies`;
CREATE TABLE IF NOT EXISTS `currencies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `amount` int(100) NOT NULL,
  `timeCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table crypto_monitor.currencies: ~0 rows (approximately)
DELETE FROM `currencies`;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;

-- Dumping structure for table crypto_monitor.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `timeCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table crypto_monitor.users: ~2 rows (approximately)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `password`, `timeCreated`) VALUES
	(1, 'admin@crypto.com', '$2a$12$QjrMehOdkzlLS48FY4GkD.rkLUMgna7wPPydd/Wk0wwSWXbCCLUhy', '2017-12-26 14:33:42'),
	(2, 'daniel@crypto.com', '$2a$12$RiUujr9I1399VZFO09GHZu1.wYCUlPdYAGWGkAgT6urn2Uc9O3enm', '2017-12-26 14:45:56');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table crypto_monitor.users_currencies
DROP TABLE IF EXISTS `users_currencies`;
CREATE TABLE IF NOT EXISTS `users_currencies` (
  `userId` int(11) unsigned NOT NULL,
  `currencyId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userId`,`currencyId`),
  KEY `userId` (`userId`),
  KEY `currencyId` (`currencyId`),
  CONSTRAINT `curencyId` FOREIGN KEY (`currencyId`) REFERENCES `currencies` (`id`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table crypto_monitor.users_currencies: ~0 rows (approximately)
DELETE FROM `users_currencies`;
/*!40000 ALTER TABLE `users_currencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_currencies` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
