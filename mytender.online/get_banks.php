<?php

include_once 'db_connection.php';

// Check connection
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli->connect_error;

    //close connection

    exit();
} else {

   // $sql = 'SELECT * FROM `banks`';
    // Query modified by noman for specific columns
    $sql = 'SELECT cities.*, users.name AS userName FROM cities INNER JOIN users ON cities.effectedBy = users.id';
    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        $row = $result->fetch_all(MYSQLI_ASSOC);
    } else {
        $row = "0 results";
    }


    echo json_encode($row);
}
?>