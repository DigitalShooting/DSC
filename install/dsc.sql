-- Adminer 4.2.2 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE TABLE `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sessionGroupID` int(11) DEFAULT NULL,
  `part` text COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `edited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `sessionGroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `disziplin` text COLLATE utf8_unicode_ci NOT NULL,
  `line` text COLLATE utf8_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  `userID` int(11) NOT NULL,
  `edited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `shot` (
  `number` int(11) NOT NULL,
  `serie` int(11) NOT NULL,
  `sessionID` int(11) NOT NULL,
  `ring` double NOT NULL,
  `ringValue` double NOT NULL,
  `teiler` double NOT NULL,
  `winkel` double NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `date` datetime NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `edited` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`number`,`sessionID`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- 2016-02-10 16:40:33
