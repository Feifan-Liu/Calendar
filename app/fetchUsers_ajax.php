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


$stmt = $mysqli->prepare("SELECT username FROM users WHERE username <> ?");

// Bind the parameter
$stmt->bind_param('s', $username);
$stmt->execute();

// Bind the results
$stmt->bind_result($usernames);

$usernameArray = array();

//fetch data from database
while ($stmt->fetch()) {
    array_push($usernameArray, $usernames);
}

//print result
echo json_encode(array(
    "success" => true,
    "usernames" => $usernameArray,
));
exit;

?>