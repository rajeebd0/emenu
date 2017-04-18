<?php

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

require_once '../../dbcon/config.php';
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != "off") ? "https" : "http";
$catPath = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/emenu/categoryImage/";
$itemPath = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/emenu/itemImage/";
$profilePath = $protocol . "://" . $_SERVER['HTTP_HOST'] . "/emenu/itemImage/";
$action = $_REQUEST['action'];
if (!empty($action)) {
    $tabid = addslashes($_REQUEST['deviceid']);
    $res_code = addslashes($_REQUEST['resturantCode']);
//    http://oditek.in/emenu/webservice/v1/customer.php?resturantCode=1234&deviceid=1111
    if ($action == 'register') {
        $sql = "SELECT * FROM " . PREFIX . "tablet WHERE deviceid='" . $tabid . "' AND restaurant_code='" . $res_code . "' AND status=1";
        $dbsql = mysqli_query($con, $sql);
        $Numrow = mysqli_num_rows($dbsql);

        if ($Numrow > 0) {
            $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "tablet SET is_login=1 WHERE deviceid='" . $tabid . "'");
            $dbsql = mysqli_query($con, "SELECT * FROM " . PREFIX . "restaurant WHERE restaurant_code='" . $res_code . "'");
            $result = mysqli_fetch_array($dbsql);
            $data = array('resturantCode' => $result['restaurant_code'], 'resturantName' => $result['name'], 'resturantlogo' => $profilePath . $result['image'], 'resturantSlogan' => $result['slogan'], 'descriptioon' => $result['description']);
            $callback = array('status' => 1, 'data' => $data);
        } else {
            $callback = array('status' => 0, 'msg' => 'Invalid Tab Id or Restaurant Code, Please try again...');
        }
        echo json_encode($callback, JSON_UNESCAPED_SLASHES);
    }
    if (isRegister($tabid, $con)) {
        if ($action == 'getCategories') {
            $sql = "SELECT * FROM " . PREFIX . "category WHERE restaurant_code='" . $res_code . "' ORDER BY name";
            $result = mysqli_query($con, $sql);
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $temp['id'] = $row['id'];
                $temp['name'] = $row['name'];
                $temp['type'] = $row['type'];
                $temp['image'] = $catPath . $row['image'];
                $data[] = $temp;
            }
            if ($data) {
                $callback = array('status' => 1, 'data' => $data);
            } else {
                $callback = array('status' => 0, 'msg' => 'No Data Found...');
            }
            echo json_encode($callback, JSON_UNESCAPED_SLASHES);
        }
        if ($action == 'getTables') {
            $sql = "SELECT * FROM " . PREFIX . "table WHERE restaurant_code='" . $res_code . "' ORDER BY table_name";
            $result = mysqli_query($con, $sql);
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $temp['id'] = $row['id'];
                $temp['name'] = $row['table_name'];
                $temp['type'] = $row['type'];
                $data[] = $temp;
            }
            if ($data) {
                $callback = array('status' => 1, 'data' => $data);
            } else {
                $callback = array('status' => 0, 'msg' => 'No Data Found...');
            }
            echo json_encode($callback, JSON_UNESCAPED_SLASHES);
        }
        if ($action == 'getItems') {
            $catid = $_POST['catid'];
            $sql = "SELECT * FROM " . PREFIX . "item WHERE category='" . $catid . "' AND restaurant_code='" . $res_code . "' ORDER BY item_name";
            $result = mysqli_query($con, $sql);
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $temp['id'] = $row['id'];
                $temp['name'] = $row['item_name'];
                $temp['price'] = $row['price'];
                $temp['foodType'] = $row['food_type'];
                $temp['foodSpice'] = $row['food_spice'];
                $temp['description'] = $row['comment'];
                $temp['image'] = $itemPath . $row['image'];
                $data[] = $temp;
            }
            if ($data) {
                $callback = array('status' => 1, 'data' => $data);
            } else {
                $callback = array('status' => 0, 'msg' => 'No Data Found...');
            }
            echo json_encode($callback, JSON_UNESCAPED_SLASHES);
        }
        if ($action == 'getSpecialOffers') {
            $sql = "SELECT * FROM " . PREFIX . "item WHERE category=0 AND (NOW() BETWEEN validfrom AND validto) AND restaurant_code='" . $res_code . "' ORDER BY item_name";
            $result = mysqli_query($con, $sql);
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $temp['id'] = $row['id'];
                $temp['name'] = $row['item_name'];
                $temp['price'] = $row['price'];
                $temp['foodType'] = $row['food_type'];
                $temp['foodSpice'] = $row['food_spice'];
                $temp['description'] = $row['comment'];
                $temp['image'] = $itemPath . $row['image'];
                $data[] = $temp;
            }
            if ($data) {
                $callback = array('status' => 1, 'data' => $data);
            } else {
                $callback = array('status' => 0, 'msg' => 'No Data Found...');
            }
            echo json_encode($callback, JSON_UNESCAPED_SLASHES);
        }
        if ($action == 'addOrder') {
            $customer_id = $_POST['customer_id'];
            $tableid = $_POST['tableid'];
            $price = $_POST['price'];
            $itemids = json_decode($_POST['itemids']);
            if (empty($customer_id)) {
                $callback = array('status' => 0, 'msg' => "Please pass Customer id");
            } else if (empty($tableid)) {
                $callback = array('status' => 0, 'msg' => "Please pass table id");
            } else if (empty($price)) {
                $callback = array('status' => 0, 'msg' => "Please pass price");
            } else if (empty($itemids)) {
                $callback = array('status' => 0, 'msg' => "Please pass Items");
            } else {
                $sql = "INSERT INTO " . PREFIX . "kot SET deviceid='" . $tabid . "',restaurant_code='" . $res_code . "',table_id='" . $tableid . "',price='" . $price . "',customer_id='" . $customer_id . "',status='new'";
                $sqlmain = mysqli_query($con, $sql);
                $id = mysqli_insert_id($con);
                foreach ($itemids as $v) {
                    $sql = "INSERT INTO " . PREFIX . "kot_item SET item_id='" . $v->itemid . "',count='" . $v->count . "',order_id='" . $id . "',status='new'";
                    $sqlmain = mysqli_query($con, $sql);
                }
                $callback = array('status' => 1, 'data' => array('kotid' => $id));
            }
            echo json_encode($callback, JSON_UNESCAPED_SLASHES);
        }
        if ($action == 'checkCustomer') {
            $mobile = $_POST['mobile'];
            $sql = "SELECT * FROM " . PREFIX . "customer WHERE restaurant_code='" . $res_code . "' and mobile='" . $mobile . "' ORDER BY customer_name";
            $result = mysqli_query($con, $sql);
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $temp['id'] = $row['id'];
                $temp['customer_name'] = $row['customer_name'];
                $temp['customer_email'] = $row['customer_email'];
                $temp['mobile'] = $row['mobile'];
                $temp['discount'] = $row['discount'];
                $temp['discount_valid'] = $row['discount_valid'];
                $data[] = $temp;
            }
            if ($data) {
                $callback = array('status' => 1, 'data' => $data);
            } else {
                $callback = array('status' => 0, 'msg' => 'No Data Found...');
            }
            echo json_encode($callback, JSON_UNESCAPED_SLASHES);
        }
        if ($action == 'addCustomer') {
            $customer_name = $_POST['customer_name'];
            $customer_email = $_POST['customer_email'];
            $mobile = $_POST['mobile'];
            $sql = "INSERT INTO " . PREFIX . "customer SET customer_name='" . $customer_name . "',customer_email='" . $customer_email . "',mobile='" . $mobile . "',restaurant_code='" . $res_code . "'";
            $sqlmain = mysqli_query($con, $sql);
            $id = mysqli_insert_id($con);
            $callback = array('status' => 1, 'data' => array('customer_id' => $id));
            echo json_encode($callback, JSON_UNESCAPED_SLASHES);
        }
    } else {
        echo json_encode(array('status' => 0, 'msg' => 'Please Register First ......'), JSON_UNESCAPED_SLASHES);
    }
}

function isRegister($deviceid, $con) {
    $sqlmain = mysqli_query($con, "SELECT * FROM " . PREFIX . "tablet WHERE deviceid='" . $deviceid . "'");
    while ($row = $sqlmain->fetch_assoc()) {
        $islogin = ($row['is_login'] == 1) ? 1 : 0;
        return $islogin;
    }
}
