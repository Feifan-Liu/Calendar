<?php
//Connect to Database
	$mysqli = new mysqli('localhost', 'wustl_inst', 'wustl_pass', 'module5');
	if($mysqli->connect_errno) {
		printf("Connection Failed: %s\n", $mysqli->connect_error);
		exit;
	}	
?>