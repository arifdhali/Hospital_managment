-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 14, 2024 at 12:58 PM
-- Server version: 8.0.27
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `doctors_booking`
--

-- --------------------------------------------------------

--
-- Table structure for table `doctor_list`
--

DROP TABLE IF EXISTS `doctor_list`;
CREATE TABLE IF NOT EXISTS `doctor_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `doctor_specalist` varchar(100) NOT NULL,
  `start_date` varchar(50) NOT NULL,
  `phone_number` varchar(12) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `doctor_list`
--

INSERT INTO `doctor_list` (`id`, `name`, `username`, `password_hash`, `doctor_specalist`, `start_date`, `phone_number`, `role`) VALUES
(1, 'Bellas ansari', 'bellas1', 'admin123', 'Cardiologist', '2019-02-10', '8976554321', 'user'),
(2, 'Sambhu gupta', 'sambhu1', 'admin123', 'Dermatologist', '2020-04-29', '9774235512', 'user'),
(3, 'Dr. Bellal', 'Bellal1', 'admin123', 'Ophthalmologist', '2023-08-15', '7895733255', 'user'),
(4, 'Arif dhali', 'arif', 'admin123', '', '', '0', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `patient_list`
--

DROP TABLE IF EXISTS `patient_list`;
CREATE TABLE IF NOT EXISTS `patient_list` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(50) DEFAULT NULL,
  `booking_date` varchar(50) DEFAULT NULL,
  `booking_time` varchar(50) DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `fk_doctor` (`doctor_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `patient_list`
--

INSERT INTO `patient_list` (`booking_id`, `patient_name`, `booking_date`, `booking_time`, `doctor_id`) VALUES
(1, 'Quail Anderson', '2024-04-29', '4:00 - 6:00', 2),
(2, 'Sanju Saha', '2024-03-15', '1:30 - 3:00', 3),
(3, 'Sammy', '2024-03-16', '9:30 - 1:00', 3),
(4, 'Isabelle Mcleod', '2024-03-14', '1:30 - 3:00', 1),
(5, 'Reagan Buckley', '2024-03-14', '1:30 - 3:00', 1),
(7, 'Patricia Owen', '2024-03-14', '1:30 - 3:00', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin_user', 'admin_password', 'admin'),
(2, 'normal_user', 'normal_password', 'user'),
(3, 'user1', 'user123', 'user');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
