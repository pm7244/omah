-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 19, 2026 at 07:38 AM
-- Server version: 8.0.45-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `omah`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_content`
--

CREATE TABLE `about_content` (
  `ac_id` int NOT NULL,
  `type` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `image` text COLLATE utf8mb4_general_ci NOT NULL,
  `layout` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `des` text COLLATE utf8mb4_general_ci NOT NULL,
  `sort_order` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about_content`
--

INSERT INTO `about_content` (`ac_id`, `type`, `image`, `layout`, `title`, `des`, `sort_order`, `ip`, `created_at`, `updated_at`, `status`) VALUES
(1, '', '[\"home page/craft.png?width=3024&height=1701&x=0&y=1232\"]', 'text-left', 'Our Craft', 'We don’t just cater, we compose.\nEach menu is custom-designed, inspired\nby your story, and brought to life with\nflavours drawn from across India and\nbeyond.\n', '1', '::1', '2025-06-28 00:00:00', '2025-06-28 00:00:00', 1),
(4, '', '[\"home page/flavours.png?width=800&height=450&x=0&y=339\"]', 'text-right', 'Flavours of Home', 'India’s culinary heritage is vast, diverse,\nand deeply soulful.\nAt OMAH, we honour its roots and bring\nits richness to the modern table, with\nelegance, emotion, and intention in every\nbite.', '2', '::1', '2025-06-28 00:00:00', '2025-06-28 00:00:00', 1),
(5, '', '[\"home page/regal.png?width=1920&height=1080&x=0&y=0\"]', 'default', 'Regal Weddings', 'From intimate rituals to grand destination weddings,\nOMAH brings grace, warmth, and soul to every celebration.\nWe understand how special this day is, and we’re here to\nmake it even more unforgettable.\nFrom welcome dinners to post-wedding brunches, we make\nevery meal part of the memory.', '3', '::1', '2025-06-28 00:00:00', '2025-06-28 00:00:00', 1),
(6, '', '[\"home page/bespoke.png?width=1024&height=576&x=0&y=574\"]', 'text-right', 'Bespoke Settings', 'For those who seek something more personal, we\noffer fully customised tables and styling. We curate\nprops and settings that fit your themes.\nWe can tailor the entire dining atmosphere to\nreflect your story and setting.\nNo templates. No repetition. An experience made\njust for you.\n\n', '4', '::1', '2025-06-28 00:00:00', '2025-06-28 00:00:00', 1),
(7, 'text-image', '[\"home page/effortless.jpg?width=2731&height=1536&x=0&y=2311\"]', 'text-left', 'Effortless Dining', 'At OMAH, we believe that luxury is not just about what’s served, but how it’s experienced. With our floating buffets, guests no longer need to wait in line. Our team brings the food straight to your tables—warm, fresh, and beautifully plated. It’s thoughtful service designed for comfort, elegance, and ease.\n', '5', '::1', '2025-07-17 00:00:00', '2025-07-17 00:00:00', 1),
(8, 'text-image', '[\"home page/beyond.png?width=1920&height=1080&x=0&y=0\"]', 'default', 'Beyond the Plate', 'Every detail, carefully curated.\nOur table styling is about more than beauty it’s\nabout creating a mood, a moment, a memory.\nWe think of the scent, the textures, the colours\neverything that makes a meal unforgettable.\n', '5', '::1', '2025-07-17 00:00:00', '2025-07-17 00:00:00', 1),
(10, 'image1', '[\"home page/intimate.png?width=1024&height=576&x=0&y=480\"]', 'text-right', 'Intimate meals', 'Private gatherings, gracefully curated. OMAH brings its signature elegance into the heart of your home. For intimate dinners, milestone moments, or soulful evenings, we create thoughtful, personal experiences designed to feel as special as they are memorable.\n', '7', '::1', '2026-01-21 11:48:05', '2026-01-21 11:48:05', 1);

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `address_id` int NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `address` text COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_no` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`address_id`, `name`, `latitude`, `longitude`, `email`, `address`, `city`, `phone_no`, `status`, `created_at`, `updated_at`, `ip`) VALUES
(11, 'Main Office', 21.1702, 72.8311, 'hello@omahluxurycatering.com', 'Based in Pune, serving across India and select destinations abroad. ', 'Surat', '8758268706', 1, '2025-06-28 11:01:09', '2025-06-28 11:01:09', '::1');

-- --------------------------------------------------------

--
-- Table structure for table `enquiries`
--

CREATE TABLE `enquiries` (
  `enquiry_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `phone_no` varchar(13) COLLATE utf8mb4_general_ci NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  `enquiry_status` tinyint(1) NOT NULL DEFAULT '0',
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enquiries`
--

INSERT INTO `enquiries` (`enquiry_id`, `name`, `email`, `phone_no`, `message`, `enquiry_status`, `ip`, `created_at`, `updated_at`) VALUES
(35, 'John Doe', 'johndoe@example.com', '9876543210', 'I\'m interested in your services. Please contact me.', 0, '::1', '2025-06-30 10:51:10', '2025-06-30 10:51:10'),
(36, 'John Doe', 'johndoe@example.com', '9876543210', 'I\'m interested in your services. Please contact me.', 1, '::1', '2025-06-30 10:51:38', '2025-06-30 10:51:38'),
(37, 'John Doe', 'johndoe@example.com', '9876543210', 'I\'m interested in your services. Please contact me.', 1, '::1', '2025-06-30 10:51:59', '2025-06-30 10:51:59'),
(38, 'Shahbaz Khan', 'johndoe@example.com', '9876543210', 'I\'m interested in your services. Please contact me.', 1, '::1', '2025-06-30 10:51:59', '2025-06-30 10:51:59'),
(39, 'test', 'Kunal@cometdigisol.com', '2535351325', 'test', 1, '103.124.205.99', '2025-07-25 16:56:23', '2025-07-25 16:56:23'),
(40, 'test', 'Kunal@cometdigisol.com', '8765456787', 'hello', 0, '::1', '2025-10-09 11:37:34', '2025-10-09 11:37:34'),
(41, 'ytguyy uytuutu', 'Kunal@cometdigisol.com', '9876543234', 'test', 0, '::1', '2025-10-09 12:13:19', '2025-10-09 12:13:19'),
(42, 'ytguyy uytuutu', 'Kunal@cometdigisol.com', '8569523698', 'test', 0, '::1', '2025-10-09 12:15:29', '2025-10-09 12:15:29');

-- --------------------------------------------------------

--
-- Table structure for table `home`
--

CREATE TABLE `home` (
  `id` int NOT NULL,
  `video` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `hero_image` text COLLATE utf8mb4_general_ci NOT NULL,
  `heroimage_text` text COLLATE utf8mb4_general_ci NOT NULL,
  `hero_title` text COLLATE utf8mb4_general_ci NOT NULL,
  `hero_sub_title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `hero_text` text COLLATE utf8mb4_general_ci NOT NULL,
  `mission_slider` text COLLATE utf8mb4_general_ci NOT NULL,
  `mission_title` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `mission_des` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `home`
--

INSERT INTO `home` (`id`, `video`, `hero_image`, `heroimage_text`, `hero_title`, `hero_sub_title`, `hero_text`, `mission_slider`, `mission_title`, `mission_des`, `meta_title`, `meta_des`, `ip`, `updated_at`, `created_at`, `status`) VALUES
(1, '[\"/home page/home.MP4\"]', '[\"home page/destination2.png\"]', 'We don’t just cater, we compose. Each menu is custom-designed, inspired by your story, and brought to life with flavours drawn from across India and beyond\n', 'The new language of luxury catering — elevated, elegant, entirely vege.', '', 'Every experience we craft isn’t just about taste — it’s about creating lasting memories. From intimate gatherings to grand celebrations, we serve moments of refined indulgence and timeless elegance.- change this to sound like are primarily focusing on weddings and destination weddings as a core product, and we also do other events', '[\n  \"royal1.png\",\n  \"royal2.png\",\n  \"seven.png\",\n  \"resort1.png\",\n  \"luxury2.png\"\n]\n', 'Our Mission', 'Create memories no one can forget.', 'Home - My Awesome Website', 'This is the homepage of My Awesome Website, offering innovative tech solutions.', '::1', '2025-07-09 11:59:18', '2025-07-09 11:59:18', 1),
(8, 'https://example.com/video.mp4', '', '', 'Welcome to the website', 'Innovate. Inspire. Impact.', 'We deliver exceptional solutions tailored to your business.', '', '', '', 'Home - My Awesome Website', 'This is the homepage of My Awesome Website, offering innovative tech solutions.', '::1', '2025-07-09 12:06:32', '2025-07-09 12:06:32', -1),
(9, 'https://example.com/video.mp4', '', '', 'Welcome to the OMAH', 'Innovate. Inspire. Impact.', 'We deliver exceptional solutions tailored to your business.', '', '', '', 'Home - My Awesome Website', 'This is the homepage of My Awesome Website, offering innovative tech solutions.', '::1', '2025-07-09 12:07:35', '2025-07-09 12:07:35', -1);

-- --------------------------------------------------------

--
-- Table structure for table `home_content`
--

CREATE TABLE `home_content` (
  `hc_id` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image1` text COLLATE utf8mb4_general_ci NOT NULL,
  `image1_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image1_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `image1_btn` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `slug1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image1_url` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `image_2` text COLLATE utf8mb4_general_ci NOT NULL,
  `image2_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image2_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `image2_btn` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `image2_url` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `text_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `text_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `text_btn` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `text_url` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `sort_order` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `slug2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `home_content`
--

INSERT INTO `home_content` (`hc_id`, `type`, `image1`, `image1_title`, `image1_des`, `image1_btn`, `slug1`, `image1_url`, `image_2`, `image2_title`, `image2_des`, `image2_btn`, `image2_url`, `text_title`, `text_des`, `text_btn`, `text_url`, `sort_order`, `slug2`, `ip`, `status`, `created_at`, `updated_at`) VALUES
(13, 'image2', '[\"eight.png?width=1920&height=1080&x=0&y=0\"]', 'Step into a world of regal indulgence.', 'Royal Wedding - Step into a world of regal indulgence.', 'Royal Wedding', 'royal', '', '[\"destination.png?width=5941&height=3342&x=0&y=0\"]', 'No matter the pin on the map, OMAH travels with your taste.', '', ' Destination Wedding', '', '', '', '', '', '0', NULL, '::1', 1, '2025-07-23 15:07:10', '2025-10-31 10:08:01'),
(14, 'text-image', '[\"heritage1.png?width=1920&height=1080&x=0&y=0\"]', 'Honour the past with food that feels timeless.', 'Heritage Wedding - Honour the past with food that feels timeless.', 'Heritage Wedding', NULL, '', '[]', '', '', '', '', 'Luxury in Every Bite', 'OMAH is a luxury vegetarian catering house, crafting immersive dining experiences defined by precision, purity, and modern elegance. Every event we touch becomes a statement in taste.', 'Luxury in Every Bite', '', '2', NULL, '::1', 1, '2025-07-23 15:11:11', '2025-10-17 10:30:12'),
(15, 'image2', '[\"resort1.png?width=570&height=321&x=0&y=0\"]', 'Let the setting be serene, and the dining unforgettable.', 'Resort Wedding - Let the setting be serene, and the dining unforgettable.', 'Resort Wedding', NULL, '', '[\"luxury1.png?width=1518&height=854&x=0&y=0\"]', 'Grandeur begins on the plate.', 'Grand Luxury Wedding - Grandeur begins on the plate.', 'Grand Luxury Wedding', '', '', '', '', '', '3', NULL, '::1', 1, '2025-07-23 15:19:13', '2025-10-17 10:30:12');

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `p_id` int NOT NULL,
  `pc_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `img_tagline` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `video` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `v_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `v_des` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `listing_image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `img_title` text COLLATE utf8mb4_general_ci NOT NULL,
  `img_des` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `ip` tinyint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`p_id`, `pc_id`, `image`, `name`, `slug`, `image_name`, `img_tagline`, `video`, `v_title`, `v_des`, `listing_image`, `img_title`, `img_des`, `meta_title`, `meta_des`, `status`, `ip`, `created_at`, `updated_at`) VALUES
(1, '4,5', '[\"frist.png?width=381&height=382&x=251&y=289\"]', 'Smart City Project', 'smart-city-project', 'Smart City Visual', 'A glimpse into the future', '[\"smartcity.mp4\"]', 'Introduction Video', 'An overview of the Smart City initiative', '[\"frist.png?width=381&height=382&x=251&y=289\"]', 'Smart City Banner', 'A modern cityscape showcasing our project', 'A modern cityscape showcasing our project', 'Sample meta description for SEO.', 1, 0, '2025-07-01 00:00:00', '2025-06-30 18:30:00'),
(11, '1,2', '[\"smart-city-main.jpg\"]', 'Smart City Infrastructure', 'smart-city-infrastructure', 'Smart City Main Banner', 'Building the Cities of Tomorrow', '[\"smartcity.mp4\"]', 'Smart City Project Overview', 'This video outlines the features and benefits of our Smart City infrastructure initiative.', '[\"smart-city-thumb.jpg\"]', 'Smart City Thumbnail', 'Thumbnail image for Smart City project listing.', 'A modern cityscape showcasing our project', 'A modern cityscape showcasing our project', 1, 0, '2025-07-01 00:00:00', '2025-06-30 18:30:00'),
(13, '1,2', '[\"smart-city-main.jpg[\"zoro-netflix.jpg?width=2478&height=2065&x=0&y=95\"]', 'Smart City Infrastructure', 'smart-city-infrastructure', 'Smart City Main Banner', 'Building the Cities of Tomorrow', '[\"smartcity.mp4\"]', 'Smart City Project Overview', 'This video outlines the features and benefits of our Smart City infrastructure initiative.', '[\"zoro-netflix.jpg?width=2478&height=2065&x=0&y=95\"]', 'Smart City Thumbnail', 'Thumbnail image for Smart City project listing.', 'A modern cityscape showcasing our project', 'A modern cityscape showcasing our project', 1, 0, '2025-07-01 00:00:00', '2025-06-30 18:30:00'),
(22, '4,5', '[\"project-image1.jpg\"]', 'Smart City Project', 'smart-city-project', 'Smart City Visual', 'A glimpse into the future', 'smartcity.mp4', 'Introduction Video', 'An overview of the Smart City initiative', 'listing-cover.jpg', 'Smart City Banner', 'A modern cityscape showcasing our project', '', '', 1, 0, '2025-07-04 00:00:00', '2025-07-03 18:30:00'),
(23, '', '[\"zoro-netflix.jpg?width=763&height=763&x=1539&y=698\"]', 'werwerwer', 'werwerwer', 'sdfsdfsf', 'sdfsdfsdf', 'Untitled design.mp4', '', '', 'logo1.png?width=248&height=305&x=416&y=387', '', '', '', '', 0, 0, '2025-07-04 00:00:00', '2025-07-03 18:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `project_industry_map`
--

CREATE TABLE `project_industry_map` (
  `pcm_id` int NOT NULL,
  `p_id` int NOT NULL,
  `pc_id` int NOT NULL,
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_industry_map`
--

INSERT INTO `project_industry_map` (`pcm_id`, `p_id`, `pc_id`, `ip`, `status`, `created_at`, `updated_at`) VALUES
(1, 14, 1, '::1', 1, '2025-07-01 00:00:00', '2025-07-01 00:00:00'),
(2, 14, 2, '::1', 1, '2025-07-01 00:00:00', '2025-07-01 00:00:00'),
(3, 17, 1, '::1', 1, '2025-07-01 00:00:00', '2025-07-01 00:00:00'),
(4, 17, 2, '::1', 1, '2025-07-01 00:00:00', '2025-07-01 00:00:00'),
(9, 18, 3, '::1', 1, '2025-07-01 00:00:00', '2025-07-01 00:00:00'),
(16, 1, 4, '::1', 1, '2025-07-02 00:00:00', '2025-07-02 00:00:00'),
(17, 1, 5, '::1', 1, '2025-07-02 00:00:00', '2025-07-02 00:00:00'),
(18, 21, 4, '::1', 1, '2025-07-03 00:00:00', '2025-07-03 00:00:00'),
(19, 21, 5, '::1', 1, '2025-07-03 00:00:00', '2025-07-03 00:00:00'),
(20, 22, 4, '::1', 1, '2025-07-04 00:00:00', '2025-07-04 00:00:00'),
(21, 22, 5, '::1', 1, '2025-07-04 00:00:00', '2025-07-04 00:00:00'),
(22, 23, 0, '::1', 0, '2025-07-04 00:00:00', '2025-07-04 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `service_content`
--

CREATE TABLE `service_content` (
  `sc_id` int NOT NULL,
  `parent_id` int NOT NULL,
  `banner_image` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `slider` text COLLATE utf8mb4_general_ci NOT NULL,
  `card_images` text COLLATE utf8mb4_general_ci NOT NULL,
  `card_text` text COLLATE utf8mb4_general_ci NOT NULL,
  `sub_title` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `tagline` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `sort_order` varchar(4) COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `image` text COLLATE utf8mb4_general_ci NOT NULL,
  `layout` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `des` text COLLATE utf8mb4_general_ci NOT NULL,
  `video` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_des` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_content`
--

INSERT INTO `service_content` (`sc_id`, `parent_id`, `banner_image`, `slider`, `card_images`, `card_text`, `sub_title`, `tagline`, `slug`, `status`, `sort_order`, `ip`, `created_at`, `updated_at`, `image`, `layout`, `title`, `des`, `video`, `meta_title`, `meta_des`) VALUES
(2, 0, '[\"banners/b1.png?width=962&height=541&x=188&y=0\"]', '[\"grazing table/grazing1.png?width=1536&height=864&x=0&y=80\",\"grazing table/table1.png?width=1716&height=965&x=0&y=0\",\"grazing table/table2.png?width=1300&height=731&x=0&y=8\"]', '[\"banners/c4.png\"]', '', 'Updated Subtitle', 'Updated Tagline', 'grazing-tables', 1, '2', '::1', '2025-07-18 11:28:15', '2025-07-18 11:28:15', '[\"luxury1.jpg?width=5462&height=3072&x=0&y=0\"]', '', 'Grazing Tables', 'Ring in forever with menus that impress.\nCocktail bites, gourmet mains, and luxury spreads — all served with flair.\nA promise sealed in flavour.\n', '[]', '', ''),
(3, 0, '[\"banners/b4.png?width=1920&height=1080&x=0&y=0\"]', '[\"corporate events/freepik__expand__72625.png?width=1216&height=684&x=0&y=10\",\"corporate events/festive2.png?width=1536&height=864&x=0&y=122\"]', '[\"banners/c1.png\"]', '', 'Updated Subtitle', 'Updated Tagline', 'corporate-events', 1, '3', '::1', '2025-07-18 11:29:15', '2025-07-18 11:29:15', '[\"five.png?width=1920&height=1080&x=0&y=0\"]', '', 'Corporate Events', 'OMAH brings refined vegetarian catering to boardrooms and ballrooms alike. From curated canapés to gourmet spreads, we craft menus that reflect your brand\'s professionalism and taste — served with precision, elegance, and flair.', '[\"contact.mp4\"]', '', ''),
(4, 0, '[\"banners/b3.png?width=1920&height=1080&x=0&y=0\"]', '[\"thematic events/events2.png?width=1536&height=864&x=0&y=116\",\"thematic events/events1.png?width=1536&height=864&x=0&y=94\"]', '[\"banners/c2.png?width=1620&height=911&x=0&y=523\"]', '', 'Updated Subtitle', 'Updated Tagline', 'thematic-events', 1, '4', '::1', '2025-07-18 11:29:28', '2025-07-18 11:29:28', '[\"two.png?width=1920&height=1080&x=0&y=0\"]', '', 'Thematic Events', 'Celebrate motherhood with gentle, graceful indulgence.\nOur soft, satvik flavours and elegant presentation honour this sacred moment.\nBecause new beginnings deserve thoughtful celebration.\n', '[\"contact.mp4\"]', '', ''),
(17, 0, '[\"banners/b2.png?width=1920&height=1080&x=0&y=0\"]', '[\"weddings/grand luxury1.jpg?width=4096&height=2304&x=0&y=0\",\"weddings/Frame 3.png?width=1284&height=722&x=0&y=32\",\"weddings/Frame 1.png?width=1280&height=720&x=0&y=34\"]', '[\"banners/c3.png\"]', '', 'Updated Subtitle', 'Updated Tagline', 'weddings', 1, '1', '::1', '2025-07-18 11:26:52', '2025-07-18 11:26:52', '[\"five.png?width=1920&height=1080&x=0&y=0\"]', 'custom-layout', 'Weddings', 'Every wedding is a story — OMAH ensures it\'s told through flavour, elegance, and detail. From intimate rituals to grand receptions, we offer bespoke culinary experiences that honour tradition while embracing timeless sophistication.', '[\"[\\\"contact.mp4\\\"]\"]', 'Updated Meta Title for SEO', 'Updated Meta Description for better search visibility.');

-- --------------------------------------------------------

--
-- Table structure for table `service_content_map`
--

CREATE TABLE `service_content_map` (
  `scm_id` int NOT NULL,
  `sc_id` int NOT NULL,
  `type` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `layout` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image1` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image1_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image1_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `image2` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image2_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image2_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `des` text COLLATE utf8mb4_general_ci NOT NULL,
  `sort_order` varchar(10) COLLATE utf8mb4_general_ci DEFAULT '0',
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_content_map`
--

INSERT INTO `service_content_map` (`scm_id`, `sc_id`, `type`, `layout`, `image1`, `image1_title`, `image1_des`, `image2`, `image2_title`, `image2_des`, `title`, `des`, `sort_order`, `status`, `created_at`, `ip`, `updated_at`) VALUES
(99, 1, 'gallery', 'default', '[\"two.png\"]', 'Image 1', 'Description 1', '[]', 'Omah', 'Grand Luxury Weddings -  Big, bold, and breathtaking.', '', '', '1', 1, '2026-01-23 04:59:15', '::1', '2026-01-23 04:59:15'),
(100, 1, 'gallery', '', '[\"seven.png\"]', 'Image 44', 'Description', '[]', 'Omah ', '', '', '', '2', 1, '2026-01-23 04:59:15', '::1', '2026-01-23 04:59:15'),
(101, 1, 'gallery', 'text-right', '[]', '', '', '[]', 'Image 2', 'Description 2', 'Signature Weddings  asdasdasdasdasdd', 'OMAH ensures it\'s told through flavour, elegance, and detail. From intimate rituals to grand receptions, we offer bespoke culinary experiences ', '3', 1, '2026-01-23 04:59:15', '::1', '2026-01-23 04:59:15'),
(102, 1, 'text-image', '', '[]', '', '', '[]', '', '', 'test', 'cvxcvxcvx', '4', 1, '2026-01-23 04:59:15', '::1', '2026-01-23 04:59:15'),
(103, 1, 'image2', '', '[\"eight.png?width=381&height=214&x=769&y=433\"]', 'mukesh', 'mukesh', '[\"eight.png?width=381&height=214&x=769&y=433\"]', 'mukesh1', 'mukesh1', '', '', '5', 1, '2026-01-23 04:59:15', '::1', '2026-01-23 04:59:15'),
(104, 1, 'image2', '', '[\"destination2.png?width=1615&height=908&x=0&y=84\"]', 'manish', 'manish', '[\"destination2.png?width=1615&height=908&x=0&y=84\"]', 'manish', 'manish', '', '', '6', 1, '2026-01-23 04:59:15', '::1', '2026-01-23 04:59:15'),
(105, 1, 'text-image', '', '[\"heritage2.png?width=768&height=432&x=0&y=66\"]', '', '', '[]', '', '', 'hero', 'hero', '7', 1, '2026-01-23 04:59:15', '::1', '2026-01-23 04:59:15'),
(290, 3, 'text-image', 'text-right', '[\"corporate events/image 9.png?width=631&height=355&x=0&y=166\"]', '', '', '[]', '', '', ' Milestone Celebrations', 'Whether it’s a landmark achievement or a meaningful transition, we design experiences that reflect the significance of the moment. Thoughtful menus and refined presentation come together to honour progress and purpose.\n', '1', 1, '2026-01-29 07:00:55', '::1', '2026-01-29 07:00:55'),
(291, 3, 'text-image', 'text-left', '[\"corporate events/party.png?width=647&height=364&x=0&y=261\"]', '', '', '[]', '', '', 'Grand openings', 'First impressions matter. Our catering for grand openings is crafted to mirror ambition and excellence, creating a welcoming experience that leaves a lasting impression on guests and partners alike.\n', '2', 1, '2026-01-29 07:00:55', '::1', '2026-01-29 07:00:55'),
(292, 3, 'image1', 'text-image', '[\"corporate events/festive.png?width=1280&height=720&x=0&y=1\"]', 'Festive celebrations', 'From seasonal gatherings to cultural festivities, we curate menus that bring people together. Rich flavours, elegant  styling, and seamless service ensure every celebration feels elevated yet effortless', '[]', '', '', '', '', '3', 1, '2026-01-29 07:00:55', '::1', '2026-01-29 07:00:55'),
(305, 4, 'text-image', 'text-left', '[\"grazing table/GRB000781.png?width=633&height=356&x=0&y=195\"]', '', '', '[]', '', '', 'Horderves', 'Each bite is custom-designed to reflect \nyour event’s mood, blending refined \npresentation with bold, memorable \nflavours drawn from across India and \nbeyond.\n', '1', 1, '2026-01-29 07:06:11', '::1', '2026-01-29 07:06:11'),
(306, 4, 'text-image', 'text-right', '[\"grazing table/table1.png?width=1716&height=965&x=0&y=0\"]', '', '', '[]', '', '', 'Dips & butters', 'Rooted in India’s diverse culinary heritage, \nour dips and butters are slow-crafted \nand deeply layered. From familiar \ncomforts to unexpected pairings, each \nelement brings richness, balance, and \nintention to the table.\n', '2', 1, '2026-01-29 07:06:11', '::1', '2026-01-29 07:06:11'),
(307, 4, 'image1', 'text-image', '[\"grazing table/table2.png?width=1300&height=731&x=0&y=8\"]', 'Charcuterie boards', 'Our charcuterie boards are a study in \ncontrast, textures, colours, and flavours \nbrought together in perfect harmony. \nCarefully curated selections invite grazing \nat leisure, turning conversation into a \nshared culinary experience.\n', '[]', '', '', '', '', '3', 1, '2026-01-29 07:06:11', '::1', '2026-01-29 07:06:11'),
(308, 4, 'text-image', 'text-right', '[\"grazing table/grazing2.png?width=1024&height=576&x=0&y=498\"]', '', '', '[]', '', '', 'Festive <br> spreads', 'Designed for celebration, our festive spreads \ncapture the spirit of abundance and joy. \nElevated classics and contemporary favourites \ncome together in vibrant displays that feel \nindulgent, generous, and unmistakably festive.\n', '4', 1, '2026-01-29 07:06:11', '::1', '2026-01-29 07:06:11'),
(309, 4, 'text-image', 'text-left', '[\"grazing table/1.jpg?width=880&height=495&x=0&y=375\"]', '', '', '[]', '', '', 'Chaat gully', 'A nostalgic nod to India’s bustling streets,\nreimagined with finesse. Our chaat gully \nblends familiar flavours with refined \nexecution bringing comfort, excitement, and \na sense of playful indulgence to your event.\n', '5', 1, '2026-01-29 07:06:11', '::1', '2026-01-29 07:06:11'),
(310, 4, 'text-image', 'text-right', '[\"grazing table/GRB002261.png?width=636&height=358&x=0&y=179\"]', '', '', '[]', '', '', 'Flavours of fusion', 'Where tradition meets innovation. Our\nfusion offerings reinterpret global and\nIndian influences with creativity and\nrestraint, delivering dishes that feel fresh,\nunexpected, and thoughtfully balanced.', '6', 1, '2026-01-29 07:06:11', '::1', '2026-01-29 07:06:11'),
(311, 17, 'text-image', 'text-left', '[\"weddings/royal wedding2.jpg?width=5233&height=2944&x=0&y=28\"]', '', '', '[]', '', '', 'Royal weddings', 'We don’t just cater, we compose. Each menu is custom-designed, inspired by your story, and brought to life with flavours drawn from across India and beyond.\n', '1', 1, '2026-01-30 09:52:55', '::1', '2026-01-30 09:52:55'),
(312, 17, 'text-image', 'text-right', '[\"weddings/resort wedding1.jpg?width=3456&height=1944&x=0&y=1799\"]', '', '', '[]', '', '', 'Resort weddings', 'India’s culinary heritage is vast, diverse, and deeply soulful. At OMAH, we honour its roots and bring its richness to the modern table, with elegance, emotion, and intention in every bite.\n', '2', 1, '2026-01-30 09:52:55', '::1', '2026-01-30 09:52:55'),
(313, 17, 'image1', 'text-image', '[\"weddings/destination wedding2.jpg?width=5376&height=3024&x=0&y=550\"]', 'Destination weddings', 'We don’t just cater, we compose. Each menu is custom-designed, inspired by your story, and brought to life with flavours drawn from across India and beyond.\n', '[]', '', '', '', '', '3', 1, '2026-01-30 09:52:55', '::1', '2026-01-30 09:52:55'),
(314, 17, 'text-image', 'text-right', '[\"weddings/heritage1.jpg?width=6324&height=3557&x=0&y=1336\"]', '', '', '[]', '', '', 'Heritage weddings', 'We honour age-old customs with carefully selected satvik ingredients, timeless flavours, and nostalgic menus.\n', '4', 1, '2026-01-30 09:52:55', '::1', '2026-01-30 09:52:55'),
(315, 17, 'text-image', 'text-left', '[\"weddings/private getaway2.jpg?width=5376&height=3024&x=0&y=378\"]', '', '', '[]', '', '', 'Private getaway weddings', 'OMAH elevates your private escape with fresh, light, and elegant menus. Think poolside brunches, garden luncheons, and evening soirees featuring curated vegetarian indulgence.\n', '5', 1, '2026-01-30 09:52:55', '::1', '2026-01-30 09:52:55'),
(316, 17, 'image1', 'text-image', '[\"weddings/grand luxury1.jpg?width=5462&height=3072&x=0&y=0\"]', 'Grand luxury weddings', 'For once-in-a-lifetime celebrations, we design immersive culinary experiences with dramatic flair, from live counters to multi-sensory plated courses. Every touchpoint feels extravagant, every dish unforgettable.\n', '[]', '', '', '', '', '6', 1, '2026-01-30 09:52:55', '::1', '2026-01-30 09:52:55'),
(317, 2, 'text-image', 'text-left', '[\"thematic events/events2.png?width=1536&height=864&x=0&y=80\"]', '', '', '[]', '', '', 'Nature <br>  at your step', 'Inspired by organic forms and natural  palettes, these setups feel grounded and  serene. Fresh elements, subtle textures, and thoughtful placements create an  atmosphere of effortless elegance.', '1', 1, '2026-01-30 09:56:08', '::1', '2026-01-30 09:56:08'),
(318, 2, 'text-image', 'text-right', '[\"thematic events/events3.png?width=1024&height=576&x=0&y=448\"]', '', '', '[]', '', '', 'Modern <br> Renaissance', 'Classic influences, reinterpreted. \nThis theme blends old-world richness with \ncontemporary restraint resulting in \nexperiences that feel timeless, layered, and \nvisually striking.\n', '2', 1, '2026-01-30 09:56:08', '::1', '2026-01-30 09:56:08'),
(319, 2, 'image1', 'text-image', '[\"thematic events/events1.png?width=1536&height=864&x=0&y=80\"]', 'Pick  your <br>Colour', 'Colour becomes the language of the event. \nFrom subtle monochromes to bold \nstatements, we design menus and setups \nthat reflect your chosen palette with \nprecision and balance.\n', '[]', '', '', '', '', '3', 1, '2026-01-30 09:56:08', '::1', '2026-01-30 09:56:08'),
(320, 2, 'text-image', 'text-right', '[\"thematic events/7.png?width=636&height=358&x=0&y=185\"]', '', '', '[]', '', '', 'Cuisine as <br> concept', 'We don’t separate food from its environment. \nCuisine becomes the concept, shaping décor, \nambience, and flow. Every element is designed \nto complement the menu’s character, creating \nan experience that feels cohesive, immersive, \nand deeply intentional.\n', '4', 1, '2026-01-30 09:56:08', '::1', '2026-01-30 09:56:08');

-- --------------------------------------------------------

--
-- Table structure for table `service_content_map_11`
--

CREATE TABLE `service_content_map_11` (
  `scm_id` int NOT NULL,
  `sc_id` int NOT NULL,
  `type` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image1` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image1_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image1_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `image2` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image2_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `image2_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `des` text COLLATE utf8mb4_general_ci NOT NULL,
  `sort_order` varchar(10) COLLATE utf8mb4_general_ci DEFAULT '0',
  `status` tinyint DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_content_map_11`
--

INSERT INTO `service_content_map_11` (`scm_id`, `sc_id`, `type`, `image1`, `image1_title`, `image1_des`, `image2`, `image2_title`, `image2_des`, `title`, `des`, `sort_order`, `status`, `created_at`, `ip`, `updated_at`) VALUES
(26, 1, 'text-image', '[\"five.png?width=1920&height=1080&x=0&y=0\"]', 'Default Image Title', 'Default Image Description', '', '', '', 'Omah', 'Set in between rice terraces and expansive green lawns, make your garden wedding dreams come true in Omah', '1', 1, '2025-07-23 12:10:07', '::1', '2025-07-23 00:00:00'),
(27, 1, 'text-image', '[\"two.png\"]', 'Default Image Title', 'Default Image Description', '[\"two.png\"]', 'Default Image Title', 'Default Image Description', '', '', '2', 1, '2025-07-23 12:10:07', '::1', '2025-07-23 00:00:00'),
(28, 1, 'text-image', '[\"eight.jpg?width=7466&height=3022&x=214&y=488\"]', 'dcdcd', 'cdczczdc', '[]', '', '', 'Omah', 'Set in between rice terraces and expansive green lawns, make your garden wedding dreams come true in Omah Pakem', '1', 1, '2025-07-23 12:53:08', '::1', '2025-07-23 00:00:00'),
(29, 2, 'image1', '[\"seven.png\"]', 'sasds', 'ddfdf', '[\"two.png\"]', 'Omah', 'Set in between rice terraces and expansive green lawns, make your garden wedding dreams come true in Omah Pakem', '', '', '2', 1, '2025-07-23 12:53:08', '::1', '2025-07-23 00:00:00'),
(30, 2, 'image1', '[\"eight.jpg?width=7466&height=3022&x=214&y=488\"]', 'desdd', 'dsd', '[\"two.png\"]', '', '', '', '', '1', 1, '2025-07-23 13:26:09', '::1', '2025-07-23 00:00:00'),
(43, 3, 'gallery', '[\"two.png\"]', 'Image 1', 'Description 1', '[\"seven.png\"]', 'Image 2 Title', 'Description 2', '', '', '1', 1, '2025-07-24 14:41:18', '103.124.205.99', '2025-07-24 14:41:18'),
(44, 3, 'gallery', '[\"two.png\"]', 'Image 44', 'Description', '[\"eight.png\"]', 'Image 4', 'Description', '', '', '2', 1, '2025-07-24 14:41:18', '103.124.205.99', '2025-07-24 14:41:18');

-- --------------------------------------------------------

--
-- Table structure for table `store_setting`
--

CREATE TABLE `store_setting` (
  `store_id` int NOT NULL,
  `name` varchar(225) NOT NULL,
  `tagline` varchar(825) NOT NULL,
  `overview` text NOT NULL,
  `logo1` varchar(825) NOT NULL,
  `logo2` varchar(825) NOT NULL,
  `dimension` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '120/100',
  `notify_email` varchar(825) NOT NULL,
  `career_email` varchar(255) NOT NULL,
  `conf_email` varchar(825) NOT NULL,
  `conf_password` varchar(225) NOT NULL,
  `conf_host` varchar(225) NOT NULL,
  `conf_port` varchar(225) NOT NULL,
  `conf_secure` varchar(225) NOT NULL,
  `meta_title` varchar(825) NOT NULL,
  `meta_desc` text NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `store_setting`
--

INSERT INTO `store_setting` (`store_id`, `name`, `tagline`, `overview`, `logo1`, `logo2`, `dimension`, `notify_email`, `career_email`, `conf_email`, `conf_password`, `conf_host`, `conf_port`, `conf_secure`, `meta_title`, `meta_desc`, `status`, `created_at`, `updated_at`, `ip`) VALUES
(10, 'omha inqury', 'sadxsdxzs', '<div>Polyester Corp is a leader in advanced composite materials, delivering high-perfor<span style=\"background-color: rgb(0, 0, 0);\">mance solutions across industries.</span></div>', '[\"uploads/logo.png?width=555&height=462&x=156&y=164\",\"9ab121b1bf5d9d7f5a3f57006dcf3d17.jpg?width=256&height=214&x=262&y=49\"]', '[\"zoro-netflix.jpg?width=2478&height=2065&x=0&y=95\"]', '120/100', 'notifications@polyester.com', 'careers@polyester.com', 'noreply@polyester.com', 'securepassword123', 'smtp.polyester.com', '587', 'omha', 'Polyester - Advanced Composites', 'Discover advanced composite materials with Polyester Corp. Industry-leading innovations in FRP and carbon fiber solutions.', 1, '2025-06-28 10:46:29', '2025-06-28 10:46:29', '::1'),
(12, 'fortunessfdfsdfsdfsfd', 'Innovating the Future of Composites', 'Polyester Corp is a leader in advanced composite materials, delivering high-performance solutions across industries.', '[\"logo-silver.png?width=198&height=165&x=1&y=0\"]', '[\"logo-silver.png?width=198&height=165&x=1&y=0\"]', '120/100', 'notifications@polyester.com', 'careers@polyester.com', 'noreply@polyester.com', 'securepassword123', 'smtp.polyester.com', '587', 'omha', 'Polyester - Advanced Composites', 'Discover advanced composite materials with Polyester Corp. Industry-leading innovations in FRP and carbon fiber solutions.', -1, '2025-06-28 10:48:38', '2025-06-28 10:48:38', '::1');

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` int NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `designation` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `image`, `name`, `designation`, `ip`, `status`, `created_at`, `updated_at`) VALUES
(1, '[\"six.png?width=869&height=1080&x=1051&y=0\"]', 'Simran Bindra', 'Co Founder', '::1', 1, '2025-10-29 11:51:50', '2026-01-28 10:49:55'),
(2, '[\"grazing table/File 57.jpg?width=3878&height=4821&x=0&y=11\"]', 'Chetan', 'Co Founder', '::1', 1, '2025-10-29 11:51:50', '2026-01-28 10:50:21'),
(3, '[\"img/team/team-1-6.jpg?width=370&height=370&x=0&y=0\"]', 'Amit Verma', 'Chief Engineer', '::1', -1, '2025-10-29 11:51:50', '2026-01-27 14:24:32'),
(4, '[\"images/bg/application.png?width=381&height=381&x=769&y=35\"]', 'Prachi Kadu', 'Founder & Chief Engineer', '::1', -1, '2025-10-29 14:40:39', '2026-01-27 14:23:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `ip` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `status`, `ip`, `created_at`, `updated_at`) VALUES
(1, 'mukesh@gmail.com', '$2b$10$Nnyejzkf3qfRcK5mKYnwy.dM50Rg.FqjIq1ZBR.xeOMGCTJPf7tpi', 1, '::1', '2025-06-27 00:00:00', '2025-06-27 00:00:00'),
(2, 'mukesh@admin', '$2b$10$UIcBs4AuA6FdMZv6/j7LGOwDnkKK/hMeUjdychV1MteQQEedZLMu2', 1, '::1', '2025-06-28 00:00:00', '2025-06-28 00:00:00'),
(3, 'omah@admin', '$2b$10$eOEVS6m7diXiOCQavJJSuOr.MJNXTswFe3v.cYb8IBFKaVwxXlXaK', 1, '::1', '2025-07-05 00:00:00', '2025-07-05 00:00:00'),
(4, 'omah', '$2b$10$7uOgZH9.ldqlG5Z.nKJHtu.eEvCuo9PfBks8FKjaNyqWIpa5EirHW', 1, '::1', '2025-10-16 14:53:43', '2025-10-16 14:53:43'),
(5, 'omah@2026', '$2b$10$TAKKAqNJSe3kZtbzO3V0SOj70XMOfmdJLn3pV8MX5MZ13uYRaTqDG', 1, '::1', '2025-12-04 17:01:30', '2025-12-04 17:01:30');

-- --------------------------------------------------------

--
-- Table structure for table `web_about`
--

CREATE TABLE `web_about` (
  `id` int NOT NULL,
  `hero_image` text COLLATE utf8mb4_general_ci NOT NULL,
  `hero_title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `hero_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `short_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `ip` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_about`
--

INSERT INTO `web_about` (`id`, `hero_image`, `hero_title`, `hero_des`, `short_id`, `status`, `ip`, `meta_title`, `meta_des`, `created_at`, `updated_at`) VALUES
(1, '[\"four.png?width=1920&height=1080&x=0&y=0\"]', 'OMAH – A New Language of Vegetarian Luxury ', 'We are a fresh take on vegetarian luxury catering.\nAt OMAH, we explore how far food can move you — emotionally, culturally, and sensorially.\nWe don’t just feed. We create atmosphere. We tell stories.\n', 'about-us', 1, '::1', 'About Us - Our Company', 'Learn more about our company\'s mission,', '2025-07-17 00:00:00', '2025-07-17 00:00:00'),
(10, 'about-banner.jpg', 'About Organization', 'We are driven by innovation, sustainability, and excellence in everything we do.', 'about-section', -1, '::1', 'About Us - Company Overview', 'Explore our mission, values, and journey in this section of our website.', '2025-07-17 00:00:00', '2025-07-17 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `web_contact`
--

CREATE TABLE `web_contact` (
  `id` int NOT NULL,
  `video` text COLLATE utf8mb4_general_ci NOT NULL,
  `video_tag` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `hero_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `form_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `ip` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_contact`
--

INSERT INTO `web_contact` (`id`, `video`, `video_tag`, `hero_des`, `form_title`, `meta_title`, `meta_des`, `status`, `ip`, `created_at`, `updated_at`) VALUES
(1, '[\"home page/home.MP4\"]', 'Contact US', '', 'Get in Touch', 'About Us - Our Vision and Missionsssd', 'Discover our company\'s core values, mission, and vision for the future.', 1, '::1', '2025-06-27 00:00:00', '2025-06-27 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `web_footer`
--

CREATE TABLE `web_footer` (
  `id` int NOT NULL,
  `footer_logo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `footer_description` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_footer`
--

INSERT INTO `web_footer` (`id`, `footer_logo`, `footer_description`, `status`, `slug`, `ip`, `created_at`, `updated_at`) VALUES
(1, '[\"logo1.png?width=248&height=248&x=416&y=416\"]', 'From concept to curation, OMAH unites food and form — offering bespoke vegetarian catering and event styling that lingers in memory.', 1, '', '::1', '2025-06-27 00:00:00', '2025-06-27 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `web_home`
--

CREATE TABLE `web_home` (
  `home_id` int NOT NULL,
  `c_image` text COLLATE utf8mb4_general_ci NOT NULL,
  `video` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `webpage_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `project_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `projects_status` tinyint NOT NULL,
  `About_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `About_status` tinyint NOT NULL,
  `ip` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_desc` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `short_des` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_home`
--

INSERT INTO `web_home` (`home_id`, `c_image`, `video`, `webpage_title`, `title`, `project_title`, `projects_status`, `About_title`, `About_status`, `ip`, `meta_title`, `meta_desc`, `updated_at`, `created_at`, `short_des`, `status`) VALUES
(1, '[\"island-night-moon.jpg?width=1525&height=857&x=3077&y=1732\"]', '[\"Untitled design.mp4\"]', 'Welcome to Our homepages', 'Building the Future', 'Smart City Development', 1, 'About us', 1, '::1', 'Home - Future Builders', 'Explore our innovative projects and vision for a smarter tomorrow.', '2025-06-27 00:00:00', '2025-06-27 00:00:00', 'Leading the way in urban innovation and infrastructure development.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `web_industry`
--

CREATE TABLE `web_industry` (
  `id` int NOT NULL,
  `hero_image` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `hero_title` varchar(70) COLLATE utf8mb4_general_ci NOT NULL,
  `hero_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `meta_title` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_description` text COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `dimension` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1960/600',
  `short_description` text COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `ip` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `sort_order` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_industry`
--

INSERT INTO `web_industry` (`id`, `hero_image`, `hero_title`, `hero_des`, `meta_title`, `meta_description`, `title`, `slug`, `dimension`, `short_description`, `description`, `ip`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, '[\"seven.png?width=1920&height=1080&x=0&y=0\"]', 'Celebrations', 'Celebrations Elevated. Flavours Curated.\nAt OMAH, we believe food is the soul of every celebration — and every event deserves more than just catering. We offer handcrafted culinary experiences rooted in tradition, refined with elegance, and served from the heart.\nWhether it’s a grand Indian wedding or an intimate family moment, our team collaborates with you to design menus and memories that linger long after the last bite\n', 'omah is the best event organizer', 'Polyester Staple Fibre is a synthetic fiber made from PET (polyethylene terephthalate), widely used as a raw material in the textile, non-woven, and automotive industries. It is produced by spinning PET chips or recycled PET flakes and is available in various deniers and cut lengths', 'events worldwide', 'omah', '1960/600', 'We produce events worldwide bridging gastronomy and design into innovative and artistic scénographies.', 'We produce events worldwide bridging gastronomy and design into innovative and artistic scénographies.', '::1', 1, 1, '2024-04-25 17:58:35', '2024-04-25 17:58:35');

-- --------------------------------------------------------

--
-- Table structure for table `web_team`
--

CREATE TABLE `web_team` (
  `t_id` int NOT NULL,
  `banner_img` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `slider1_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `slider1_img` text COLLATE utf8mb4_general_ci NOT NULL,
  `slider2_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `slider2_img` text COLLATE utf8mb4_general_ci NOT NULL,
  `img_title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image` text COLLATE utf8mb4_general_ci NOT NULL,
  `meta_title` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `meta_des` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL,
  `ip` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `web_team`
--

INSERT INTO `web_team` (`t_id`, `banner_img`, `slider1_title`, `slider1_img`, `slider2_title`, `slider2_img`, `img_title`, `image`, `meta_title`, `meta_des`, `status`, `ip`, `created_at`, `updated_at`) VALUES
(1, '[\"team/a45221c681f6de6f28f406cf576c1950ffa8bd8e (1).png?width=1920&height=1080&x=0&y=0\"]', 'The Team', '[\"team/img1.jpg?width=4096&height=2304&x=0&y=427\",\"team/img2.png?width=3420&height=1924&x=0&y=163\",\"team/Untitled design.png?width=1283&height=722&x=0&y=21\"]', 'The Food', '[\"destination.png?width=5941&height=3342&x=0&y=90\",\"destination2.png?width=1615&height=908&x=0&y=18\",\"getaway2.png?width=1665&height=937&x=0&y=87\",\"three.png?width=1920&height=1080&x=0&y=0\",\"seven.png?width=1920&height=1080&x=0&y=0\"]', 'Testimonial', '[\"luxury1.jpg?width=5462&height=3072&x=0&y=0\"]', 'Omah - meta title', 'Omah - meta des', 1, '::1', '2026-01-24 15:24:13', '2026-03-14 15:17:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_content`
--
ALTER TABLE `about_content`
  ADD PRIMARY KEY (`ac_id`);

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`address_id`);

--
-- Indexes for table `enquiries`
--
ALTER TABLE `enquiries`
  ADD PRIMARY KEY (`enquiry_id`);

--
-- Indexes for table `home`
--
ALTER TABLE `home`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `home_content`
--
ALTER TABLE `home_content`
  ADD PRIMARY KEY (`hc_id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`p_id`);

--
-- Indexes for table `project_industry_map`
--
ALTER TABLE `project_industry_map`
  ADD PRIMARY KEY (`pcm_id`);

--
-- Indexes for table `service_content`
--
ALTER TABLE `service_content`
  ADD PRIMARY KEY (`sc_id`);

--
-- Indexes for table `service_content_map`
--
ALTER TABLE `service_content_map`
  ADD PRIMARY KEY (`scm_id`);

--
-- Indexes for table `service_content_map_11`
--
ALTER TABLE `service_content_map_11`
  ADD PRIMARY KEY (`scm_id`);

--
-- Indexes for table `store_setting`
--
ALTER TABLE `store_setting`
  ADD PRIMARY KEY (`store_id`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `web_about`
--
ALTER TABLE `web_about`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `web_contact`
--
ALTER TABLE `web_contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `web_footer`
--
ALTER TABLE `web_footer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `web_home`
--
ALTER TABLE `web_home`
  ADD PRIMARY KEY (`home_id`);

--
-- Indexes for table `web_industry`
--
ALTER TABLE `web_industry`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `web_team`
--
ALTER TABLE `web_team`
  ADD PRIMARY KEY (`t_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_content`
--
ALTER TABLE `about_content`
  MODIFY `ac_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `address_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `enquiries`
--
ALTER TABLE `enquiries`
  MODIFY `enquiry_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `home`
--
ALTER TABLE `home`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `home_content`
--
ALTER TABLE `home_content`
  MODIFY `hc_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `p_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `project_industry_map`
--
ALTER TABLE `project_industry_map`
  MODIFY `pcm_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `service_content`
--
ALTER TABLE `service_content`
  MODIFY `sc_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `service_content_map`
--
ALTER TABLE `service_content_map`
  MODIFY `scm_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=321;

--
-- AUTO_INCREMENT for table `service_content_map_11`
--
ALTER TABLE `service_content_map_11`
  MODIFY `scm_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `store_setting`
--
ALTER TABLE `store_setting`
  MODIFY `store_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `web_about`
--
ALTER TABLE `web_about`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `web_contact`
--
ALTER TABLE `web_contact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `web_footer`
--
ALTER TABLE `web_footer`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `web_home`
--
ALTER TABLE `web_home`
  MODIFY `home_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `web_industry`
--
ALTER TABLE `web_industry`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `web_team`
--
ALTER TABLE `web_team`
  MODIFY `t_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
