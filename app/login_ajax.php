<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//     Connect to Database
require 'newMySQLConnection.php';

ini_set("session.cookie_httponly", 1);

$json_str = file_get_contents('php://input');
//store the data into an associative array
$json_obj = json_decode($json_str, true);
//access variables
$username = $json_obj['username'];
$password = $json_obj['password'];

$stmt = $mysqli->prepare("SELECT COUNT(*),hashed_password,id FROM users WHERE username=?");

// Bind the parameter
$stmt->bind_param('s', $username);

$stmt->execute();

// Bind the results
$stmt->bind_result($cnt, $pwd_hash, $userid);

$stmt->fetch();

//if found user, let user log in
if ($cnt == 1 && password_verify($password, $pwd_hash)) {
    session_start();
    $_SESSION['username'] = $username;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

    echo json_encode(array(
        "success" => true,
        "username" => $username,
		"userid" => $userid,
		"token" => $_SESSION['token']
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password",
    ));
    exit;
}
?>