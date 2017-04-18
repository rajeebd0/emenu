<?php

require_once '../dbcon/config.php';
$action = $_GET['act'];
$res_code = $_SESSION["menu_restaurant_code"];
switch ($action) {
    case 'addItem':
        $itemname = addslashes($_POST['itemname']);
        $selectCategory = $_POST['selectCategory'];
        $price = $_POST['price'];
        $price = number_format($price, 2);
        $comment = $_POST['comment'];
        $foodType = $_POST['foodType'];
        $foodspicy = $_POST['foodspicy'];
        $id = $_POST['id'];
        if ($id != 'undefined' && $id != '') {
            $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "item SET item_name='" . $itemname . "',category='" . $selectCategory . "',price='" . $price . "',food_type='" . $foodType . "',food_spice='" . $foodspicy . "',comment='" . $comment . "',restaurant_code='" . $res_code . "' WHERE id='" . $id . "'");
        } else {
            $sqlmain = mysqli_query($con, "INSERT INTO " . PREFIX . "item SET item_name='" . $itemname . "',category='" . $selectCategory . "',price='" . $price . "',food_type='" . $foodType . "',food_spice='" . $foodspicy . "',comment='" . $comment . "',restaurant_code='" . $res_code . "'");
            $id = mysqli_insert_id($con);
        }


        if (!empty($_FILES['image'])) {
            $filedata = $_FILES['image']['tmp_name'];
            $file = $_FILES['image']['name'];
            $imgFile = preg_replace('/[-`~!@#$%\^&*()+={}[\]\\\\|;:\'",><?\/]/ ', '_', $file);
            $img = str_replace(' ', '_', $imgFile);
            $fileName = time() . '_' . $img;
            if (move_uploaded_file($_FILES["image"]["tmp_name"], '../itemImage/' . $fileName))
                $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "item SET image='" . $fileName . "' WHERE id='" . $id . "'");
        }
        echo $id;
        break;

    case 'viewItems':
        $result = mysqli_query($con, "SELECT i.*,c.name FROM " . PREFIX . "item i LEFT JOIN " . PREFIX . "category c ON i.category=c.id WHERE i.category != 0 ORDER BY i.item_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'getDetailItem':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "SELECT i.*,c.name FROM " . PREFIX . "item i LEFT JOIN " . PREFIX . "category c ON i.category=c.id WHERE i.id='" . $id . "' ORDER BY i.item_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'deleteItem':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "DELETE FROM " . PREFIX . "item WHERE id='" . $id . "'");
        echo $result;
        break;

    case 'geteditedItem':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "SELECT i.*,c.name FROM " . PREFIX . "item i LEFT JOIN " . PREFIX . "category c ON i.category=c.id WHERE i.id='" . $id . "' ORDER BY i.item_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;
}
?>