<?php
header("Access-Control-Allow-Origin: *"); // React Development Server erlauben
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'connection.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["error" => "Ungültige Eingaben"]);
    exit();
}

$username = $conn->real_escape_string($data->username);
$email = $conn->real_escape_string($data->email);
$password = password_hash($data->password, PASSWORD_DEFAULT);
$token = bin2hex(random_bytes(32)); // Token generieren

$check_sql = "SELECT * FROM User WHERE Email = '$email'";
$check_result = $conn->query($check_sql);
if ($check_result->num_rows > 0) {
    echo json_encode(["error" => "E-Mail bereits registriert"]);
    exit();
}

$sql = "INSERT INTO User (Username, Email, Password, Token) VALUES ('$username', '$email', '$password', '$token')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Registrierung erfolgreich", "token" => $token]);
} else {
    echo json_encode(["error" => "Fehler beim Registrieren: " . $conn->error]);
}

$conn->close();
?>
