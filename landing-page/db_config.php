<?php
	// Create connection to db
	$mysqli = new mysqli("50.62.209.38:3306", "driffleskii", "pepsodent62", "driffleskii_");

	// Check connection
    if ($mysqli->connect_error) {
        die('Connect Error (' . $mysqli->connect_errno . ') ' . $mysqli->connect_error);
    }
?>
