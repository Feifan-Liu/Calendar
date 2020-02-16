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
$userid = $json_obj['userid'];
$tag = $json_obj['tag'];
$usernames = $json_obj['userGroups'];
$groupFlag = $json_obj['groupFlag'];

//check CSRF token
if (!hash_equals($_SESSION['token'], $json_obj['token'])) {
    die("Request forgery detected");
}

$userids = array();

//find userid for each user
for ($i = 0; $i < sizeof($usernames); $i++) {
    $stmt = $mysqli->prepare("select id from users where username = ?");
    $stmt->bind_param('s', $usernames[$i]);
    $stmt->execute();
    $stmt->bind_result($id);
    $stmt->fetch();
    array_push($userids, $id);
    $stmt->close();
}

//add event and grouped tag for each user
for ($i = 0; $i < sizeof($userids); $i++) {
    if (($groupFlag) == 1) {
        $stmt = $mysqli->prepare("insert into tags (user_id, name, grouped) values (?, ?, ?)");
        $stmt->bind_param('iss', $userids[$i], $tag, $groupFlag);
        $stmt->execute();
        $stmt->close();
    }

    $stmt = $mysqli->prepare("insert into user_events (user_id, content,date,tag_name) values (?, ?, ?, ?)");
    $stmt->bind_param('isss', $userids[$i], $content, $date, $tag);
    $stmt->execute();
    $stmt->close();
}

echo json_encode(array(
    "success" => true,
));
exit;
?>