<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//     Connect to Database
require 'newMySQLConnection.php';

ini_set("session.cookie_httponly", 1);

$json_str = file_get_contents('php://input');
//store the data into an associative array
$json_obj = json_decode($json_str, true);
//access variables
$userid = $json_obj['userid'];

$stmt = $mysqli->prepare("select username, user_id_share from user_shared_calendars
join users on user_shared_calendars.user_id_share = users.id where user_id_shared = ? ");
$stmt->bind_param('i',$userid);
// Bind the parameter
$stmt->execute();

// Bind the results
$stmt->bind_result($username, $user_id_share);

$username_shares = array();
$user_id_shares = array();

//fetch data from database
while ($stmt->fetch()) {
    array_push($username_shares, $username);
    array_push($user_id_shares, $user_id_share);
}
echo json_encode(array(
    "success" => true,
    "username_shares" => $username_shares,
    "user_id_shares" => $user_id_shares,
));
exit;
//print result


?>