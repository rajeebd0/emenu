<?php

require_once '../dbcon/config.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user_name = $request->u_name;
$user_pass = $request->u_password;

$userid = htmlspecialchars(trim($user_name));
$password = sha1(htmlspecialchars(trim($user_pass)));
$sqllogin = sprintf("select * from " . PREFIX . "restaurant where loginid='%s' and hash_pass='%s'", $userid, $password);
$dbsql = mysqli_query($con, $sqllogin);
$Numrow = mysqli_num_rows($dbsql);

if ($Numrow > 0) {
    $result = mysqli_fetch_array($dbsql);
    $_SESSION["menu_restaurant_id"] = $result['id'];
    $_SESSION["menu_restaurant_code"] = $result['restaurant_code'];
} else {
    header("HTTP/1.0 401 Unauthorized");
    $result['msg'] = 'Invalid username or password, Please try again...';
}
echo json_encode($result);
?>