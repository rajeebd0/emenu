<?php

require_once '../dbcon/config.php';
$action = $_GET['act'];
switch ($action) {
    case 'addSetting':
        $restaurantname = addslashes($_POST['restaurantname']);
        $loginid = addslashes($_POST['loginid']);
        $pwd = addslashes($_POST['pwd']);
        $slogan = addslashes($_POST['slogan']);
        $comment = addslashes($_POST['comment']);
        $id = addslashes($_POST['id']);
        if ($id != 'undefined' && $id != '') {
            $sql = "UPDATE " . PREFIX . "restaurant SET name='" . $restaurantname . "', loginid='" . $loginid . "', slogan='" . $slogan . "', description='" . $comment . "'";
            if ($pwd != '')
                $sql.=", hash_pass='" . sha1(htmlspecialchars(trim($pwd))) . "', act_pass='" . $pwd . "'";
            $sql.="WHERE id='" . $id . "'";
            $sqlmain = mysqli_query($con, $sql);
        }

        if (!empty($_FILES['image'])) {
            $filedata = $_FILES['image']['tmp_name'];
            $file = $_FILES['image']['name'];
            $imgFile = preg_replace('/[-`~!@#$%\^&*()+={}[\]\\\\|;:\'",><?\/]/ ', '_', $file);
            $img = str_replace(' ', '_', $imgFile);
            $fileName = time() . '_' . $img;
            if (move_uploaded_file($_FILES["image"]["tmp_name"], '../profileImage/' . $fileName)) {
                $result = mysqli_query($con, "SELECT image FROM " . PREFIX . "restaurant WHERE id='" . $id . "'");
                $data = array();
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
                if(file_exists('../profileImage/' . $data[0]['image'])){
                    unlink('../profileImage/' . $data[0]['image']);
                }
                $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "restaurant SET image='" . $fileName . "' WHERE id='" . $id . "'");
            }
        }
        echo $id;
        break;

    case 'viewSetting':
        $id = $_SESSION["menu_restaurant_id"];

        $result = mysqli_query($con, "SELECT id, name, loginid, image, slogan, restaurant_code, description FROM " . PREFIX . "restaurant WHERE id='" . $id . "' AND status='1' ORDER BY name");
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