<?php

require_once '../dbcon/config.php';
$action = $_GET['act'];
$res_code = $_SESSION["menu_restaurant_code"];
switch ($action) {
    case 'addTab':
        $tabname = addslashes($_POST['tabname']);
        $tabid = addslashes($_POST['tabid']);
        $status = addslashes($_POST['status']);
        $id = $_POST['id'];
        if ($id != 'undefined' && $id != '') {
            $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "tablet SET devicename='" . $tabname . "', deviceid='" . $tabid . "', restaurant_code='" . $res_code . "', status='" . $status . "' WHERE id='" . $id . "'");
        } else {
            $sqlmain = mysqli_query($con, "INSERT INTO " . PREFIX . "tablet SET devicename='" . $tabname . "', deviceid='" . $tabid . "', restaurant_code='" . $res_code . "', status='" . $status . "'");
            $id = mysqli_insert_id($con);
        }
        echo $id;
        break;

    case 'viewTab':
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "tablet ORDER BY devicename");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'getSingleTab':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "tablet WHERE id='" . $id . "' ORDER BY devicename");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'deleteTab':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "DELETE FROM " . PREFIX . "tablet WHERE id='" . $id . "'");
        echo $result;
        break;
}



