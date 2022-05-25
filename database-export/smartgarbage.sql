CREATE DATABASE  IF NOT EXISTS `smart_garbage` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `smart_garbage`;
-- MySQL dump 10.13  Distrib 5.7.37, for Win64 (x86_64)
--
-- Host: localhost    Database: smart_garbage
-- ------------------------------------------------------
-- Server version	5.5.5-10.5.15-MariaDB-0+deb11u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `action` (
  `actionid` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(150) NOT NULL,
  PRIMARY KEY (`actionid`),
  UNIQUE KEY `description_UNIQUE` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action`
--

LOCK TABLES `action` WRITE;
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
INSERT INTO `action` VALUES (7,'Button of Raspberry pi is pressed'),(5,'Button of the lcd is pressed'),(1,'Door1 is closed'),(3,'Door1 is locked'),(2,'Door1 is open'),(4,'Door1 is unlocked'),(20,'Door2 is closed'),(21,'Door2 is locked'),(18,'Door2 is open remote'),(19,'Door2 is open with badge'),(22,'Door2 is unlocked'),(13,'Lcd is off'),(12,'Lcd is on'),(6,'Lcd show ip address'),(16,'Location changed'),(9,'Measure volume value'),(10,'Measure weight value'),(14,'New user added'),(8,'Raspberry pi is poweroff'),(11,'Show volume value'),(15,'User deleted'),(17,'User logged in');
/*!40000 ALTER TABLE `action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device` (
  `deviceid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `brand` varchar(45) DEFAULT NULL,
  `description` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL,
  `cost` float DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`deviceid`),
  UNIQUE KEY `name_idx` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
INSERT INTO `device` VALUES (1,'Servo',NULL,'Door lock','SG90 Mini Servo',3.25,NULL),(2,'Magnet contact',NULL,'Door status','Reed Relais 2*14mm',0.4,NULL),(3,'Ultrasoon',NULL,'Volume meter','HC-SR04',3,'mm'),(4,'Weight',NULL,'Weight meter','Load Cell - 50kg',3,'kg'),(5,'LCD',NULL,'Display','LCD Display 16*2',4,NULL),(6,'RFID',NULL,'Badge reader','MFRC522',5.5,NULL),(7,'RGB-LED',NULL,'Show volume','8-bit RGB LEDs WS2812b',2.49,NULL),(8,'Button',NULL,'Button status','PBS-33B',NULL,NULL);
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history` (
  `historyid` int(11) NOT NULL AUTO_INCREMENT,
  `action_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `value` varchar(50) DEFAULT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `deviceid` int(11) DEFAULT NULL,
  `actionid` int(11) NOT NULL,
  PRIMARY KEY (`historyid`),
  KEY `fk_history_device_idx` (`deviceid`),
  KEY `fk_history_action1_idx` (`actionid`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES (1,'2022-05-23 10:52:22','387535',NULL,6,17),(2,'2022-05-23 11:08:49',NULL,NULL,4,1),(3,'2022-05-23 15:13:51','0',NULL,2,1),(4,'2022-05-23 15:35:22','1',NULL,2,1),(5,'2022-05-23 17:12:14',NULL,NULL,1,3),(6,'2022-05-23 17:32:05','0',NULL,2,2),(7,'2022-05-23 19:06:39','1',NULL,2,1),(8,'2022-05-23 23:22:27','0',NULL,2,2),(9,'2022-05-24 01:58:04','1',NULL,2,1),(10,'2022-05-24 02:09:32','34',NULL,3,9),(11,'2022-05-24 02:12:13','0,11',NULL,4,10),(12,'2022-05-24 03:21:09',NULL,NULL,7,11),(13,'2022-05-24 04:32:59',NULL,NULL,5,6),(14,'2022-05-24 04:40:08',NULL,NULL,5,12),(15,'2022-05-24 05:11:57',NULL,NULL,5,13),(16,'2022-05-24 05:23:18',NULL,NULL,5,6),(17,'2022-05-24 10:40:42',NULL,NULL,8,7),(18,'2022-05-24 11:03:51',NULL,NULL,NULL,8),(19,'2022-05-24 11:54:20',NULL,NULL,7,11),(20,'2022-05-24 12:12:39',NULL,NULL,5,6),(21,'2022-05-24 15:08:39','1',NULL,4,5),(22,'2022-05-24 17:15:05',NULL,NULL,5,6),(23,'2022-05-24 18:25:46','0',NULL,2,2),(24,'2022-05-24 18:37:30','1',NULL,2,1),(25,'2022-05-24 19:49:37','22',NULL,3,9),(26,'2022-05-24 21:01:37','0,32',NULL,4,10),(27,'2022-05-24 21:04:21','387535',NULL,6,17),(28,'2022-05-25 02:40:56',NULL,NULL,4,1),(29,'2022-05-25 02:50:03','0',NULL,2,1),(30,'2022-05-25 03:54:03',NULL,NULL,7,11),(31,'2022-05-25 04:02:52',NULL,NULL,5,6),(32,'2022-05-25 04:50:29','0,2',NULL,4,9),(33,'2022-05-25 09:40:03',NULL,NULL,5,12),(34,'2022-05-25 09:49:14',NULL,NULL,5,13),(35,'2022-05-25 10:20:42','0',NULL,2,2),(36,'2022-05-25 12:06:35','1',NULL,2,1),(37,'2022-05-25 13:27:38','55',NULL,3,9),(38,'2022-05-25 13:39:40','0,5',NULL,4,10),(39,'2022-05-25 14:08:32','387535',NULL,6,17),(40,'2022-05-25 15:48:01',NULL,NULL,4,1),(41,'2022-05-25 17:07:01','0',NULL,2,1),(42,'2022-05-25 18:25:45',NULL,NULL,7,11),(43,'2022-05-25 20:57:36',NULL,NULL,1,18),(44,'2022-05-25 22:30:18',NULL,NULL,5,6),(45,'2022-05-25 23:50:28',NULL,NULL,5,12),(46,'2022-05-26 01:16:31',NULL,NULL,5,13),(47,'2022-05-26 03:01:54','0',NULL,2,2),(48,'2022-05-26 05:21:39','1',NULL,2,1),(49,'2022-05-26 07:16:53','70',NULL,3,9),(50,'2022-05-26 07:20:53','0,9',NULL,4,10);
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `locationid` int(11) NOT NULL AUTO_INCREMENT,
  `coordinates` varchar(100) NOT NULL,
  `address` varchar(150) NOT NULL,
  PRIMARY KEY (`locationid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Dorpsstraat, 8200 Brugge','51.188469, 3.212996');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `badgeid` decimal(10,0) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'leix3','123',3847385);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-25 13:20:06
