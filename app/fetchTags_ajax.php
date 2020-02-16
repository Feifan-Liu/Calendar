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
$grouped = $json_obj['grouped'];

$stmt = $mysqli->prepare("select name from tags where user_id = ? and grouped = ?");
$stmt->bind_param('ii',$userid , $grouped);
// Bind the parameter
$stmt->execute();

// Bind the results
$stmt->bind_result($tag);

$tags = array();

//fetch data from database
while ($stmt->fetch()) {
    array_push($tags, $tag);
}
echo json_encode(array(
    "success" => true,
    "tags" => $tags,
));
exit;
//print result


?>