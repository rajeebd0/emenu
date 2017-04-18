<?php

require_once '../dbcon/config.php';
$action = $_GET['act'];
$res_code = $_SESSION["menu_restaurant_code"];
switch ($action) {
    case 'addTable':
        $tablename = $_POST['tablename'];
        $type = $_POST['type'];
        $id = $_POST['id'];
        if ($id != 'undefined' && $id != '') {
            $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "table SET table_name='" . $tablename . "',type='" . $type . "',restaurant_code='" . $res_code . "' WHERE id='" . $id . "'");
        } else {
            $sqlmain = mysqli_query($con, "INSERT INTO " . PREFIX . "table SET table_name='" . $tablename . "',type='" . $type . "',restaurant_code='" . $res_code . "'");
            $id = mysqli_insert_id($con);
        }

        echo $id;
        break;

    case 'viewTable':
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "table ORDER BY table_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'getTable':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "table WHERE id='" . $id . "' ORDER BY table_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'getSingleTable':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "table WHERE id='" . $id . "' ORDER BY table_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'deleteTable':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "DELETE FROM " . PREFIX . "table WHERE id='" . $id . "'");
        echo $result;
        break;
}
?>