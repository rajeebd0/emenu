<?php

require_once '../dbcon/config.php';
$action = $_GET['act'];
$res_code = $_SESSION["menu_restaurant_code"];
switch ($action) {
    case 'addofferSpecial':
        $itemname = addslashes($_POST['itemname']);
        $selectCategory = 0;
        $price = $_POST['price'];
        $price = number_format($price, 2);
        $comment = $_POST['comment'];
        $foodType = $_POST['foodType'];
        $foodspicy = $_POST['foodspicy'];
        $fromdate = $_POST['fromdate'];
        $todate = $_POST['todate'];
        $id = $_POST['id'];
        if ($id != 'undefined' && $id != '') {
            $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "item SET item_name='" . $itemname . "',category='" . $selectCategory . "',price='" . $price . "',food_type='" . $foodType . "',food_spice='" . $foodspicy . "',comment='" . $comment . "',validfrom='" . $fromdate . "',validto='" . $todate . "',restaurant_code='" . $res_code . "' WHERE id='" . $id . "'");
        } else {
            $sqlmain = mysqli_query($con, "INSERT INTO " . PREFIX . "item SET item_name='" . $itemname . "',category='" . $selectCategory . "',price='" . $price . "',food_type='" . $foodType . "',food_spice='" . $foodspicy . "',comment='" . $comment . "',validfrom='" . $fromdate . "',validto='" . $todate . "',restaurant_code='" . $res_code . "'");
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

    case 'viewofferSpecial':
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "item  WHERE category=0 AND restaurant_code='" . $res_code . "' ORDER BY item_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'editedofferSpecial':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "item  WHERE id='" . $id . "' ORDER BY item_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'deleteofferSpecial':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "DELETE FROM " . PREFIX . "item WHERE id='" . $id . "'");
        echo $result;
        break;
}
?>