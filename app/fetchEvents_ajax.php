<?php
header("Content-Type: application/json");

ini_set("session.cookie_httponly", 1);

//Connect to Database
require 'newMySQLConnection.php';

$json_str = file_get_contents('php://input');
//store the data into an associative array
$json_obj = json_decode($json_str, true);
//access variables:
$shareusers = $json_obj['shareusers'];
$prevdate = $json_obj['prevdate'];
$nextdate = $json_obj['nextdate'];
$userid = $json_obj['userid'];
if(sizeof($userid) == 0){
    echo json_encode(array(
        "success" => false,
    ));
    exit;
}
$tagArray = $json_obj['tags'];
$tagString = implode("','",$tagArray);
$stmt = $mysqli->prepare("select id, date, content, tag_name from user_events 
where user_id = ? and date > ? and date < ? and tag_name in ('$tagString') order by date");
$stmt->bind_param('iss',$userid, $prevdate, $nextdate);

$stmt->execute();

$stmt->bind_result($id, $date, $content, $tagname);

$idArray = array();
$dateArray = array();
$contentArray = array();
$shareuserids = array();
$tagnameArray = array();
//fetch data from database
while ($stmt->fetch()) {
    array_push($idArray, htmlentities($id));
    array_push($dateArray, htmlentities($date));
    array_push($contentArray, htmlentities($content));
    array_push($tagnameArray, htmlentities($tagname));
}

$stmt->close();

for ($i = 0; $i < sizeof($shareusers); $i++) {
//find user ids
    $stmt = $mysqli->prepare("select id from users where username = ?");
    $stmt->bind_param('s', $shareusers[$i]);
    $stmt->execute();
    $stmt->bind_result($userid);
    $stmt->fetch();
    array_push($shareuserids, $userid);
    $stmt->close();
}

//print result
//fetch all the events that are shared from others
for ($i = 0; $i < sizeof($shareuserids); $i++) {
    $stmt = $mysqli->prepare("select id, date, content, tag_name  from user_events where user_id = ? order by date");
    $stmt->bind_param('i', $shareuserids[$i]);
    $stmt->execute();
    $stmt->bind_result($id, $date, $content, $tagname);
    //fetch data from database
    while ($stmt->fetch()) {
        array_push($idArray, htmlentities($id));
        array_push($dateArray, htmlentities($date));
        array_push($contentArray, htmlentities($content));
        array_push($tagnameArray, htmlentities($tagname));
    }
    $stmt->close();
}

//print result
echo json_encode(array(
    "success" => true,
    "ids" => $idArray,
    "dates" => $dateArray,
    "contents" => $contentArray,
    "tags" => $tagnameArray
));
exit;
?>