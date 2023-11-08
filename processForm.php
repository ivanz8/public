<?php
if (isset($_POST['submit'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $message = $_POST['message'];

    // Create or open the CSV file
    $csvFile = 'data.csv';
    $csvData = array($name, $email, $phone, $message);

    // Append the data to the CSV file
    $file = fopen($csvFile, 'a'); // 'a' means append mode
    fputcsv($file, $csvData);
    fclose($file);

    // Redirect to a thank you page or back to the form
    header('Location: contact.html');
    exit();
}
?>
