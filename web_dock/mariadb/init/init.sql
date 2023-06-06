-- สร้างฐานข้อมูล 'exampledb' หากยังไม่มี
CREATE DATABASE IF NOT EXISTS exampledb;
-- เลือกใช้ฐานข้อมูล 'exampledb'
USE exampledb;

-- สร้างตาราง 'users'
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;