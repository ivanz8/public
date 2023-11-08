<?php
$csvFile = 'user_credentials.csv';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST["action"];

    if ($action === "login") {
        $username = trim($_POST["username"]);
        $password = trim($_POST["password"]);

        // Check if the user's credentials exist in the CSV file
        $handle = fopen($csvFile, "r");
        $validLogin = false;

        while (($row = fgetcsv($handle, 1000, ",")) !== false) {
            $csvUsername = trim($row[0]);
            $csvPassword = trim($row[1]);

            if ($csvUsername === $username && $csvPassword === $password) {
                $validLogin = true;
                break;
            }
        }

        fclose($handle);

        if ($validLogin) {
            // Handle successful login
            // ...

            // For now, let's assume you've successfully logged in.
            // You can set up a session or redirect to a dashboard page.
            session_start();
            $_SESSION['username'] = $username;
            header("Location: dashboard.html");
            exit();
        } else {
            echo "Invalid login credentials. Please try again.";
        }
    } elseif ($action === "signup") {
        $newUsername = trim($_POST["newUsername"]);
        $newPassword = trim($_POST["newPassword"]);

        // Append the new user to the CSV file
        $handle = fopen($csvFile, "a");
        fputcsv($handle, [$newUsername, $newPassword]);
        fclose($handle);

        // Redirect to the login page after signup
        header("Location: log.html");
        exit();
    } else {
        echo "Invalid action.";
    }
}
?>
