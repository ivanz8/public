<?php
session_start(); // Start a session or resume the current session

// Check if the user is logged in
if (isset($_SESSION['username'])) {
    // Clear all session data
    session_unset();

    // Destroy the session
    session_destroy();

    // Redirect to the login page (login.html)
    header("Location: log.html");
    exit();
} else {
    // If the user is not logged in, redirect to the login page
    header("Location: log.html");
    exit();
}
