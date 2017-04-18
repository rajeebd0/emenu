<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
error_reporting(1);
$con = new mysqli("localhost", "root", "123456", "emenu");		//oditek.in
if ($con->connect_error)die("Connection failed: ");	
define("PREFIX", "odi_");
?>
