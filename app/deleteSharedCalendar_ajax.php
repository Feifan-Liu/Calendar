<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//     Connect to Database
require 'newMySQLConnection.php';
session_start();
ini_set("session.cookie_httponly", 1);

$json_str = file_get_contents('php://input');
//store the data into an associative array
$json_obj = json_decode($json_str, true);

//fetch variables
$user_id_shares = $json_obj['user_id_shares'];
$userid = $json_obj['userid'];

//check if user entered valid username and password

if(!hash_equals($_SESSION['token'], $json_obj['token'])){
	die("Request forgery detected");
}

//delete calendar
$stmt = $mysqli->prepare("delete from user_shared_calendars where user_id_shared = ? and user_id_share = ?");

$stmt->bind_param('ii', $userid, $user_id_shares);

if ($stmt->execute()) {
    echo json_encode(array(
        "success" => true,
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "failed",
    ));
    exit;
}
?>