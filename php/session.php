<?php
require_once '../dbcon/config.php'; 
$result = mysqli_query($con, "SELECT * FROM ".PREFIX."restaurant WHERE id=".$_SESSION["menu_restaurant_id"]);
$data = array();
while ($row =mysqli_fetch_assoc($result)) {
  $data[] = $row;
}
if($data){
	print json_encode($data);
}else{
	header("HTTP/1.0 401 Unauthorized");
	print "session has destroyed";
}
?>