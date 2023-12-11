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
} else {
    echo "Connected successfully!";
}

// Optionally, you can set character set and other configurations if needed
// $mysqli->set_charset("utf8");

// Now, $mysqli can be used for executing queries and interacting with the database

// Remember to close the connection when done
// $mysqli->close();
?>
