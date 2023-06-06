<?php
$servername = "db"; // ชื่อของ container MariaDB ใน docker-compose
$username = "root"; // ชื่อผู้ใช้ MariaDB
$password = "root"; // รหัสผ่าน MariaDB
$dbname = "exampledb"; // ชื่อฐานข้อมูล MariaDB

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to database successfully!";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>