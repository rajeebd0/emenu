var dashboard = angular.module('Emenu');
dashboard.controller('viewItemController', function ($scope, $http, $state, $window, $location) {
    $scope.categorydata = [{
            name: 'Select Category',
            value: ''
        }];
    $scope.form = [];
    $scope.files = [];
    $http({
        method: 'GET',
        url: 'php/session.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        //console.log('session',response);
        $location.path('viewItem');
    }, function errorCallback(response) {
        $state.go('/', {}, {reload: true});
    });

    $scope.logout = function () {
        $http({
            method: 'POST',
            url: 'php/logout.php',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {

        }, function errorCallback(response) {

        });
    };

    viewCategory();
    function viewCategory() {
        $http.get("php/category.php?act=viewCategory").success(function (data) {
            for (i = 0; i < data.length; i++) {
                $scope.categorydata.push({'value': data[i]['id'], 'name': data[i]['name']});
            }
        });
    }
    ;

    viewItem();
    function viewItem() {
        $http.get("php/item.php?act=viewItems").success(function (data) {
            $scope.itemdata = data;
        });
    }
    ;

    $scope.viewItemComment = function (id) {
        $('#viewitempopdiv').modal('show');
        var userData = {'id': id};
        $http({
            method: 'POST',
            url: 'php/item.php?act=getDetailItem',
            data: userData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.comment = response.data[0]['comment'];
        }, function errorCallback(response) {

        });
    };

    $scope.deleteItem = function (id) {
        if (confirm("are you sure to delete?")) {
            var userData = {'id': id};
            $http({
                method: 'POST',
                url: 'php/item.php?act=deleteItem',
                data: userData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                if (response.data == 1) {
                    //alert("Deleted Successfully");
                    viewItem();
                } else {
                    alert("Couldn't delete, Please try again later!!!");
                }
            }, function errorCallback(response) {

            });
        }
    };

    $scope.editIem = function (id) {
//        $('#EDITDIV').show();
//        $('#LISTDIV').hide();
        var userData = {'id': id};
        $http({
            method: 'POST',
            url: 'php/item.php?act=geteditedItem',
            data: userData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.foo = {};
            $scope.foo.bar = true;
            //$scope.selectCategory.value=response.data[0]['category'];
            $scope.itemname = response.data[0]['item_name'];
            $scope.price = response.data[0]['price'];
            $scope.image_source = 'itemImage/' + response.data[0]['image'];
            $scope.foodType = response.data[0]['food_type'];
            $scope.foodspicy = response.data[0]['food_spice'];
            $scope.comment = response.data[0]['comment'];
            $scope.hidid = id;
        }, function errorCallback(response) {

        });
    };

    $scope.submit = function () {
        $scope.form.image = $scope.files[0];
        if ($scope.itemname == '' || $scope.itemname == null) {
            alert("Please enter Item Name");
            var element = $window.document.getElementById("itemname");
            element.focus();
        } else if ($scope.selectCategory.value == '' || $scope.selectCategory.value == null) {
            alert("Please select category");
            var element = $window.document.getElementById("selectCategory");
            element.focus();
        } else if ($scope.price == '' || $scope.price == null) {
            alert("Please enter price");
            var element = $window.document.getElementById("price");
            element.focus();
        } else if ($scope.hidid == '' && ($scope.form.image == '' || $scope.form.image == null)) {
            alert("Please upload Item Image");
            var element = $window.document.getElementById("img");
            element.focus();
        } else if ($scope.foodType == '' || $scope.foodType == null) {
            alert("Please Choose veg/nonveg");
            var element = $window.document.getElementById("foodType");
            element.focus();
        } else if ($scope.foodspicy == '' || $scope.foodspicy == null) {
            alert("Please choose spicy category");
            var element = $window.document.getElementById("foodspicy");
            element.focus();
        } else {
            $http({
                method: 'POST',
                url: 'php/item.php?act=addItem',
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("image", $scope.form.image);
                    formData.append("itemname", $scope.itemname);
                    formData.append("selectCategory", $scope.selectCategory.value);
                    formData.append("price", $scope.price);
                    formData.append("comment", $scope.comment);
                    formData.append("foodType", $scope.foodType);
                    formData.append("foodspicy", $scope.foodspicy);
                    formData.append("id", $scope.hidid);
                    return formData;
                },
                data: $scope.form,
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (data) {
                if (data > 0) {
                    alert("Saved Successfully");
                    $scope.foo.bar = false;
                    $('#img').val('');
                    $scope.itemname = '';
                    $scope.selectCategory = '';
                    $scope.comment = '';
                    $scope.price = '';
                    $scope.foodType = '';
                    $scope.foodspicy = '';
                    viewItem();
//                    $('#EDITDIV').hide();
//                    $('#LISTDIV').show();
                } else {
                    alert("Couldn't save, Please try again later!!!");
                }
            });
        }
    };

    $scope.cancelSave = function () {
//        $('#EDITDIV').hide();
//        $('#LISTDIV').show();
        $scope.foo = {};
        $scope.foo.bar = false;
        $('#img').val('');
        $scope.itemname = '';
        $scope.selectCategory = '';
        $scope.comment = '';
        $scope.price = '';
        $scope.foodType = '';
        $scope.foodspicy = '';
    };
});