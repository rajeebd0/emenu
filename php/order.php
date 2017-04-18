<?php

require_once '../dbcon/config.php';
$action = $_GET['act'];
$res_code = $_SESSION["menu_restaurant_code"];
switch ($action) {
    case 'newOrder':
        $result = mysqli_query($con, "SELECT *,(SELECT table_name FROM " . PREFIX . "table WHERE id=" . PREFIX . "kot.table_id) AS tablename FROM " . PREFIX . "kot WHERE restaurant_code='" . $res_code . "' AND status!='past' ORDER BY date");
        $orderitem = $data = array();
        while ($row = $result->fetch_assoc()) {
            $dbsql = mysqli_query($con, "SELECT * FROM " . PREFIX . "item i INNER JOIN " . PREFIX . "kot_item oi ON i.id = oi.item_id WHERE oi.order_id='" . $row["id"] . "'");
            while ($row1 = $dbsql->fetch_assoc()) {
                $orderitem[] = $row1["item_name"] . "(" . $row1["count"] . " Plated)";
            }
            $row["item_ids"] = implode(",", $orderitem);
//            $row["status"] = ($row["status"] === "new") ? "New Order" : (($row["status"] === "cook") ? "Cooking" : "Past");
            $data[] = $row;
            $orderitem = array();
        }
        if ($data) {
            print json_encode($data, JSON_UNESCAPED_SLASHES);
        }
        break;

    case 'pastOrder':
        $result = mysqli_query($con, "SELECT *,(SELECT table_name FROM " . PREFIX . "table WHERE id=" . PREFIX . "kot.table_id) AS tablename FROM " . PREFIX . "kot WHERE restaurant_code='" . $res_code . "' AND status='past' ORDER BY date");
        $orderitem = $data = array();
        while ($row = $result->fetch_assoc()) {
            $dbsql = mysqli_query($con, "SELECT * FROM " . PREFIX . "item i INNER JOIN " . PREFIX . "kot_item oi ON i.id = oi.item_id WHERE oi.order_id='" . $row["id"] . "'");
            while ($row1 = $dbsql->fetch_assoc()) {
                $orderitem[] = $row1["item_name"] . "(" . $row1["count"] . " Plated)";
            }
            $row["item_ids"] = implode(",", $orderitem);
//            $row["status"] = "Past Order";
            $data[] = $row;
            $orderitem = array();
        }
        if ($data) {
            print json_encode($data, JSON_UNESCAPED_SLASHES);
        }
        break;
}
?>