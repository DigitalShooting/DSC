
-- Create Database
CREATE DATABASE IF NOT EXISTS dsc;
USE dsc;


-- Create User (Change Password)
CREATE USER 'dsc'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON dsc.* TO 'dsc'@'%' WITH GRANT OPTION;


-- Create Tables
SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `disziplin`;
CREATE TABLE `disziplin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `disziplin` text COLLATE utf8_unicode_ci NOT NULL,
  `line` text COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `disziplinID` int(11) NOT NULL,
  `part` text COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DROP TABLE IF EXISTS `shot`;
CREATE TABLE `shot` (
  `number` int(11) NOT NULL,
  `sessionID` int(11) NOT NULL,
  `ring` double NOT NULL,
  `teiler` double NOT NULL,
  `winkel` double NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`number`,`sessionID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
