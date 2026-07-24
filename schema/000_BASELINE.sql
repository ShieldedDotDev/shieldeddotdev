/*
 Navicat Premium Dump SQL

 Source Server         : Shielded.dev
 Source Server Type    : MariaDB
 Source Server Version : 100338 (10.3.38-MariaDB-0+deb10u1)
 Source Host           : localhost:3306
 Source Schema         : shielded

 Target Server Type    : MariaDB
 Target Server Version : 100338 (10.3.38-MariaDB-0+deb10u1)
 File Encoding         : 65001

 Date: 24/07/2026 10:25:40
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for shields
-- ----------------------------
DROP TABLE IF EXISTS `shields`;
CREATE TABLE `shields` (
  `shield_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `public_id` varchar(128) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` varchar(255) NOT NULL,
  `color` varchar(6) NOT NULL,
  `secret` varchar(255) NOT NULL,
  `stamp_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `stamp_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`shield_id`) USING BTREE,
  UNIQUE KEY `secret` (`secret`),
  UNIQUE KEY `unqz_public_id` (`public_id`) USING BTREE,
  KEY `user_id` (`user_id`),
  CONSTRAINT `shields_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(10) unsigned NOT NULL,
  `login` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
