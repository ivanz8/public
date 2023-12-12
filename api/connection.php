<?php
// Database Connection Parameters
$host = 'sql.freedb.tech';
$port = '3306';
$database = 'freedb_library_app';
$user = 'freedb_clicheboy';
$password = 'M$7ec4Z!r*kEXEP';

// Establishing the Connection
$mysqli = new mysqli($host, $user, $password, $database, $port);

// Check the Connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
} else


?>
