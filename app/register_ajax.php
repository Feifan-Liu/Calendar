<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//     Connect to Database
require 'newMySQLConnection.php';

ini_set("session.cookie_httponly", 1);

$json_str = file_get_contents('php://input');
//store the data into an associative array
$json_obj = json_decode($json_str, true);
//fetch variables
$username = $json_obj['username_reg'];
$password = $json_obj['password_reg'];

//check if user entered valid username and password
if (!preg_match('/^[\w_\-]+$/', $username) || !preg_match('/^[\w_\-]+$/', $password)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Invalid input",
    ));
    exit;
}

//insert a new user to database
$stmt = $mysqli->prepare("insert into users (username,hashed_password) values (?, ?)");
$hashpwd = password_hash($password, PASSWORD_BCRYPT);
// Bind the parameter
$stmt->bind_param('ss', $username, $hashpwd);

if ($stmt->execute()) {
    session_start();
    $_SESSION['username'] = $username;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
    $stmt->close();
    //find user id after insertion
    $stmt = $mysqli->prepare("select id from users where username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($userid);
    $stmt->fetch();
    $stmt->close();
    $stmt = $mysqli->prepare("insert into tags (name,user_id) values ('Default',?)");
    $stmt->bind_param('i', $userid);
    $stmt->execute();
    echo json_encode(array(
        "success" => true,
        "username" => $username,
        "userid" => $userid,
        "token" => $_SESSION['token'],
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Register failed",
    ));
    exit;
}
?>