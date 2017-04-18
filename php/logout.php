<?php
session_start();
//print_r($_SESSION);
session_unset();
session_destroy();
if(session_destroy()){

	echo "User logged out successfully";
}else{
	echo "User could not log out successfully";
}
?>