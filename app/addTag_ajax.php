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
$newtag = $json_obj['newtag'];
$userid = $json_obj['userid'];

//check if user entered valid username and password
if (!preg_match('/^[\w_\-]+$/', $newtag)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid input",
    ));
    exit;
}

if(!hash_equals($_SESSION['token'], $json_obj['token'])){
	die("Request forgery detected");
}

//insert a new user to database
$stmt = $mysqli->prepare("insert into tags (name,user_id) values (?, ?)");

$stmt->bind_param('si', $newtag, $userid);

if ($stmt->execute()) {
    echo json_encode(array(
        "success" => true,
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Add Tag failed",
    ));
    exit;
}
?>