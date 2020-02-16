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
$content = $json_obj['content'];
$date = $json_obj['date'];
$tag = $json_obj['tag'];
$username = $json_obj['username'];

if(!hash_equals($_SESSION['token'], $json_obj['token'])){
	die("Request forgery detected");
}
//find userid via username
$stmt = $mysqli->prepare("select id from users where username = ?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($userid);

$stmt->fetch();
$stmt->close();
$stmt = $mysqli->prepare("insert into tags (name,user_id) values (?, ?)");

$stmt->bind_param('si', $tag, $userid);

$stmt->execute();

$stmt->close();

$stmt = $mysqli->prepare("insert into user_events (tag_name, user_id,content,date) values (?, ?, ?, ?)");

// Bind the parameter
$stmt->bind_param('siss', $tag, $userid, $content, $date);
//add event to database
if ($stmt->execute()) {

    echo json_encode(array(
        "success" => true
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "failed to share event",
    ));
    exit;
}
?>