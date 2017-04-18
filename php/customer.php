<?php

require_once '../dbcon/config.php';
$action = $_GET['act'];
$res_code = $_SESSION["menu_restaurant_code"];
switch ($action) {

    case 'addCustomer':
        $customer_email = addslashes($_POST['customer_email']);
        $customer_name = $_POST['customer_name'];
        $mobile = $_POST['mobile'];
        $discount_valid = $_POST['discount_valid'];
        $discount = $_POST['discount'];
        $id = $_POST['id'];
        if ($id != 'undefined' && $id != '') {
            $sqlmain = mysqli_query($con, "UPDATE " . PREFIX . "customer SET customer_name='" . $customer_name . "', customer_email='" . $customer_email . "', mobile='" . $mobile . "', discount_valid='" . $discount_valid . "', discount='" . $discount . "' WHERE id='" . $id . "'");
        } else {
            $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "customer WHERE restaurant_code='" . $res_code . "' AND customer_email='" . $customer_email . "'");
            if ($result->num_rows) {
                $data['err'] = 1;
                $data['msg'] = 'Email ID ' . $customer_email . ' Already Exist';
                print json_encode($data, JSON_UNESCAPED_SLASHES);
                exit;
            }
            $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "customer WHERE restaurant_code='" . $res_code . "' AND mobile='" . $mobile . "'");
            if ($result->num_rows) {
                $data['err'] = 1;
                $data['msg'] = 'Mobile no ' . $mobile . ' Already Exist';
                print json_encode($data, JSON_UNESCAPED_SLASHES);
                exit;
            }
            $sqlmain = mysqli_query($con, "INSERT INTO " . PREFIX . "customer SET customer_name='" . $customer_name . "', customer_email='" . $customer_email . "', mobile='" . $mobile . "', discount_valid='" . $discount_valid . "', discount='" . $discount . "', restaurant_code='" . $res_code . "'");
            $id = mysqli_insert_id($con);
        }
        echo $id;
        break;

    case 'viewCustomer':
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "customer WHERE restaurant_code='" . $res_code . "' ORDER BY customer_name");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data, JSON_UNESCAPED_SLASHES);
        }
        break;

    case 'editCustomer':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "SELECT * FROM " . PREFIX . "customer  WHERE id='" . $id . "'");
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        if ($data) {
            print json_encode($data);
        }
        break;

    case 'deleteCustomer':
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $id = $request->id;
        $result = mysqli_query($con, "DELETE FROM " . PREFIX . "customer WHERE id='" . $id . "'");
        echo $result;
        break;
}
?>
