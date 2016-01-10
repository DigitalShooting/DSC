
-- Create Database
CREATE DATABASE IF NOT EXISTS dsc;
USE dsc;


-- Create User (Change Password)
GRANT ALL ON `dsc`.* TO 'dsc'@'%' IDENTIFIED BY 'password';


-- Create Tables
SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';


-- Update table name
RENAME TABLE disziplin TO sessionGroup;
ALTER TABLE session CHANGE `disziplinID` `sessionGroupID` int(11);



CREATE TABLE IF NOT EXISTS `sessionGroup` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`)
);
ALTER TABLE `disziplin` ADD COLUMN `disziplin` text COLLATE utf8_unicode_ci NOT NULL;
ALTER TABLE `disziplin` ADD COLUMN `line` text COLLATE utf8_unicode_ci NOT NULL;
ALTER TABLE `disziplin` ADD COLUMN `date` datetime NOT NULL;



CREATE TABLE IF NOT EXISTS `session` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`)
);
ALTER TABLE `session` ADD COLUMN `disziplinID` int(11) NOT NULL;
ALTER TABLE `session` ADD COLUMN `part` text COLLATE utf8_unicode_ci NOT NULL;
ALTER TABLE `session` ADD COLUMN `date` datetime NOT NULL;



CREATE TABLE IF NOT EXISTS `shot`  (
	`number` int(11) NOT NULL,
	`sessionID` int(11) NOT NULL,
	PRIMARY KEY (`number`,`sessionID`)
);
ALTER TABLE `shot` ADD COLUMN `ring` double NOT NULL;
ALTER TABLE `shot` ADD COLUMN `teiler` double NOT NULL;
ALTER TABLE `shot` ADD COLUMN `winkel` double NOT NULL;
ALTER TABLE `shot` ADD COLUMN `x` double NOT NULL;
ALTER TABLE `shot` ADD COLUMN `y` double NOT NULL;
ALTER TABLE `shot` ADD COLUMN `date` datetime NOT NULL;
