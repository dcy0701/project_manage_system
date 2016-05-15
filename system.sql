-- MySQL dump 10.13  Distrib 5.7.12, for osx10.11 (x86_64)
--
-- Host: localhost    Database: system
-- ------------------------------------------------------
-- Server version	5.7.12

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
-- Table structure for table `golocation`
--

DROP TABLE IF EXISTS `golocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `golocation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(255) DEFAULT NULL,
  `user` varchar(20) DEFAULT NULL,
  `project_id` varchar(11) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `flag` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=170 DEFAULT CHARSET=utf8 COMMENT='管理表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `golocation`
--

LOCK TABLES `golocation` WRITE;
/*!40000 ALTER TABLE `golocation` DISABLE KEYS */;
INSERT INTO `golocation` VALUES (168,'1463228861040','dcy','北交','37.33468587$-122.02357768','./uploads/dcy-1463228861040.jpg',1),(169,'1463228868317','dcy','北交','37.33468587$-122.02357768','./uploads/dcy-1463228868317.jpg',1);
/*!40000 ALTER TABLE `golocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_apply`
--

DROP TABLE IF EXISTS `project_apply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_apply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_check_id` varchar(11) DEFAULT NULL COMMENT '检查项id',
  `user_id` varchar(20) DEFAULT NULL COMMENT '用户id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8 COMMENT='信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_apply`
--

LOCK TABLES `project_apply` WRITE;
/*!40000 ALTER TABLE `project_apply` DISABLE KEYS */;
INSERT INTO `project_apply` VALUES (1,'3','dcy'),(2,'0','dcy'),(3,'0','dcy'),(4,'0','dcy'),(5,'0','dcy'),(6,'0','dcy'),(7,'0','dcy'),(8,'4','dcy'),(9,'4','dcy'),(10,'0','dcy'),(11,'0','dcy'),(12,'0','dcy'),(13,'3','dcy'),(14,'3','dcy'),(15,'0','dcy'),(16,'0','dcy'),(17,'0','dcy'),(18,'0','dcy'),(19,'3','dcy'),(20,'3','dcy'),(21,'3','dcy'),(22,'3','dcy'),(23,'0','dcy'),(24,'3','dcy'),(25,'3','dcy'),(26,'0','dcy'),(27,'0','dcy'),(28,'2','dcy'),(29,'2','dcy'),(30,'2','dcy'),(31,'1','dcy'),(32,'3','dcy'),(33,'0','dcy'),(34,'0','dcy'),(35,'0','dcy'),(36,'2','dcy'),(37,'0','dcy'),(38,'0','dcy'),(39,'0','dcy'),(40,'0','dcy'),(41,'3','dcy'),(42,'2','dcy'),(43,'0','dcy'),(44,'0','dcy'),(45,'2','dcy'),(46,'0','dcy'),(47,'0','dcy'),(48,'2','dcy'),(49,'2','dcy'),(50,'0','dcy'),(51,'0','dcy'),(52,'0','dcy'),(53,'0','dcy'),(54,'0','dcy'),(55,'0','dcy'),(56,'0','dcy'),(57,'0','dcy'),(58,'2','dcy'),(59,'北交','dcy'),(60,'北交','dcy'),(61,'北交','dcy'),(62,'北交','dcy'),(63,'北交','dcy'),(64,'北交','dcy'),(65,'北交','dcy'),(66,'北交','dcy'),(67,'北交','dcy'),(68,'北交','dcy'),(69,'北交','dcy'),(70,'北交','dcy'),(71,'北交','dcy'),(72,'北交','dcy'),(73,'北交','dcy'),(74,'北交','dcy'),(75,'北交','dcy');
/*!40000 ALTER TABLE `project_apply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_check_info`
--

DROP TABLE IF EXISTS `project_check_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_check_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_check_id` varchar(11) DEFAULT NULL COMMENT '检查项id',
  `user_id` varchar(20) DEFAULT NULL COMMENT '用户id',
  `detail` varchar(20) DEFAULT NULL COMMENT '备注',
  `datetime` varchar(20) DEFAULT NULL COMMENT '进度更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='进度信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_check_info`
--

LOCK TABLES `project_check_info` WRITE;
/*!40000 ALTER TABLE `project_check_info` DISABLE KEYS */;
INSERT INTO `project_check_info` VALUES (1,'123','dcy','null','222');
/*!40000 ALTER TABLE `project_check_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_id`
--

DROP TABLE IF EXISTS `project_id`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_id` (
  `id` varchar(11) NOT NULL DEFAULT '',
  `father_id` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_id`
--

LOCK TABLES `project_id` WRITE;
/*!40000 ALTER TABLE `project_id` DISABLE KEYS */;
INSERT INTO `project_id` VALUES ('东京大学','日本区'),('中央财经','朝阳区'),('北交','东城区'),('北京大学','大兴区'),('北师','海淀区'),('北航','海淀区'),('北邮','海淀区'),('北邮宏福校区','昌平区'),('北邮沙河校区','昌平区'),('外经贸','朝阳区');
/*!40000 ALTER TABLE `project_id` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_table`
--

DROP TABLE IF EXISTS `project_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_table` (
  `project_id` varchar(11) NOT NULL DEFAULT '' COMMENT '工程id',
  `parent_id` varchar(11) DEFAULT NULL COMMENT '父工程id',
  `code` varchar(255) DEFAULT NULL COMMENT '工程编号',
  `name` varchar(255) DEFAULT NULL COMMENT '项目名称',
  `year_create` varchar(255) DEFAULT NULL COMMENT '建设年度',
  `manager` varchar(255) DEFAULT NULL COMMENT '项目负责人',
  `location` varchar(255) DEFAULT NULL COMMENT '建设地点',
  `investment` varchar(255) DEFAULT NULL COMMENT '投资',
  `designer` varchar(255) DEFAULT NULL COMMENT '设计单位',
  `designer_incharge` varchar(255) DEFAULT NULL COMMENT '设计负责人',
  `supervision_incharge` varchar(255) DEFAULT NULL COMMENT '监理负责人',
  `constructor` varchar(255) DEFAULT NULL COMMENT '施工单位',
  `constructor_incharge` varchar(255) DEFAULT NULL COMMENT '施工负责人',
  `district` varchar(255) DEFAULT NULL COMMENT '所属区县',
  `type` varchar(10) DEFAULT NULL COMMENT '类型',
  `plan_start_time` datetime DEFAULT NULL COMMENT '计划开工时间',
  `real_start_time` datetime DEFAULT NULL COMMENT '实际开工时间',
  `plan_end_time` datetime DEFAULT NULL COMMENT '计划完工时间',
  `real_end_time` datetime DEFAULT NULL COMMENT '实际完工时间',
  `gps_lat` varchar(255) DEFAULT NULL COMMENT '经度',
  `gps_lon` varchar(255) DEFAULT NULL COMMENT '纬度',
  `state` varchar(10) DEFAULT NULL COMMENT '项目状态',
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_table`
--

LOCK TABLES `project_table` WRITE;
/*!40000 ALTER TABLE `project_table` DISABLE KEYS */;
INSERT INTO `project_table` VALUES ('',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('东京大学','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'39.983171','116.308479',NULL),('中央财经大学',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'39.983171','116.308479',NULL),('北交',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('北京大学',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'39.983171','116.308479',NULL),('北师',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('北航','1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'null','null',NULL),('北邮',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'39.983171','116.308479',NULL);
/*!40000 ALTER TABLE `project_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_tocheck`
--

DROP TABLE IF EXISTS `project_tocheck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_tocheck` (
  `id` int(11) NOT NULL,
  `project_id` varchar(11) DEFAULT NULL COMMENT '所属工程id',
  `time` datetime DEFAULT NULL COMMENT '建设时间',
  `type` varchar(20) DEFAULT NULL,
  `begin_time` datetime DEFAULT NULL COMMENT '预计开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '预计完工时间',
  `target` varchar(20) DEFAULT NULL COMMENT '量化指标',
  `target_now` varchar(20) DEFAULT NULL COMMENT '量化指标已完成',
  `state` int(11) DEFAULT NULL COMMENT '检查项状态（进行中，已完成）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='项目进度管理表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_tocheck`
--

LOCK TABLES `project_tocheck` WRITE;
/*!40000 ALTER TABLE `project_tocheck` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_tocheck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `area` varchar(255) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'dcy','dcy0701','北京',0);
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

-- Dump completed on 2016-05-14 20:29:09
