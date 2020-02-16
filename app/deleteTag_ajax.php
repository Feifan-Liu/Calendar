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
$tag = $json_obj['tag'];
$userid = $json_obj['userid'];

//check if user entered valid username and password

if(!hash_equals($_SESSION['token'], $json_obj['token'])){
	die("Request forgery detected");
}

//delete tag
$stmt = $mysqli->prepare("delete from tags where name = ? and user_id = ?");

$stmt->bind_param('si', $tag, $userid);

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