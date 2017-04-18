<?php

require_once '../dbcon/config.php';
$action = $_GET['act'];
switch ($action) {
    case 'addCategory':
        $categoryname = addslashes($_POST['categoryname']);
        $type = $_POST['type'];
        $id = $_POST['id'];
        if ($id != 'undefined' && $id != '') {
            $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "category SET name='" . $categoryname . "',type='" . $type . "' WHERE id='" . $id . "'");
        } else {
            $sqlmain = mysqli_query($con, "INSERT INTO " . PREFIX . "category SET name='" . $categoryname . "',type='" . $type . "'");
            $id = mysqli_insert_id($con);
        }

        if (!empty($_FILES['image'])) {
            $filedata = $_FILES['image']['tmp_name'];
            $file = $_FILES['image']['name'];
            $imgFile = preg_replace('/[-`~!@#$%\^&*()+={}[\]\\\\|;:\'",><?\/]/ ', '_', $file);
            $img = str_replace(' ', '_', $imgFile);
            $fileName = time() . '_' . $img;
            if (move_uploaded_file($_FILES["image"]["tmp_name"], '../categoryImage/' . $fileName))
                $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "category SET image='" . $fileName . "' WHERE id='" . $id . "'");
        }
        echo $id;
        break;

    case 'viewCategory':
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "category ORDER BY name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'getSingleCategory':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "category WHERE id='" . $id . "' ORDER BY name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'deleteCategory':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "DELETE FROM " . PREFIX . "category WHERE id='" . $id . "'");
        $result = mysqli_query($con, "DELETE FROM " . PREFIX . "item WHERE category='" . $id . "'");
        echo $result;
        break;
}
?>