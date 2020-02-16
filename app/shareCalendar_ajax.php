<?php
header("Content-Type: application/json");
ini_set("session.cookie_httponly", 1);
session_start();
//Connect to Database
require 'newMySQLConnection.php';

$json_str = file_get_contents('php://input');
//store the data into an associative array
$json_obj = json_decode($json_str, true);
//access variables:
$username_shared = $json_obj['username_shared'];
$userid_share = $json_obj['userid_share'];

//check CSRF token
if (!hash_equals($_SESSION['token'], $json_obj['token'])) {
    die("Request forgery detected");
}

//find userid for the user to be shared

$stmt = $mysqli->prepare("select id from users where username = ?");
$stmt->bind_param('s', $username_shared);
$stmt->execute();
$stmt->bind_result($userid_shared);
$stmt->fetch();
$stmt->close();

//add this share relationship to database

$stmt = $mysqli->prepare("insert into user_shared_calendars (user_id_shared, user_id_share) values (?, ?)");
$stmt->bind_param('ii', $userid_shared, $userid_share);
$stmt->execute();
$stmt->close();

echo json_encode(array(
    "success" => true,
));
exit;
?>