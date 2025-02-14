<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "https://bbzwinf.ch/";
$username = "testuser";
$password = "a%e152aO1";  // Ersetze mit deinem DB-Passwort
$dbname = "BMSD22a_Traderoo";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Verbindung fehlgeschlagen: " . $conn->connect_error]));
} else {
    echo "✅ MySQL Connected Successfully!";
}
?>
