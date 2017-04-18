var dashboard = angular.module('Emenu');
dashboard.controller('offerSpecialController', function ($scope, $http, $state, $window, $location) {
    var element = $window.document.getElementById("itemname");
    element.focus();
    $scope.form = [];
    $scope.files = [];
    $scope.fromdate = '';
    $scope.todate = '';
    $http({
        method: 'GET',
        url: 'php/session.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        //console.log('session',response);
        $location.path('offerSpecial');
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

    $scope.uploadedFile = function (element) {
        $scope.foo = {};
        $scope.foo.bar = true;
        $scope.currentFile = element.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            $scope.image_source = event.target.result
            $scope.$apply(function ($scope) {
                $scope.files = element.files;
            });
        }
        reader.readAsDataURL(element.files[0]);
    };

    viewItem();
    function viewItem() {
        $http.get("php/offerSpecial.php?act=viewofferSpecial").success(function (data) {
            $scope.itemdata = data;
        });
    }
    ;

    $scope.deleteItem = function (id) {
        if (confirm("are you sure to delete?")) {
            var userData = {'id': id};
            $http({
                method: 'POST',
                url: 'php/offerSpecial.php?act=deleteofferSpecial',
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

    $scope.editItem = function (id) {
        var userData = {'id': id};
        $http({
            method: 'POST',
            url: 'php/offerSpecial.php?act=editedofferSpecial',
            data: userData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.foo = {};
            $scope.foo.bar = true;
//            $scope.selectCategory.value = response.data[0]['category'];
            $scope.itemname = response.data[0]['item_name'];
            $scope.price = response.data[0]['price'];
            $scope.image_source = 'itemImage/' + response.data[0]['image'];
            $scope.foodType = response.data[0]['food_type'];
            $scope.foodspicy = response.data[0]['food_spice'];
            $scope.comment = response.data[0]['comment'];
            $scope.fromdate = response.data[0]['validfrom'];
            $scope.todate = response.data[0]['validto'];
            $scope.hidid = id;
        }, function errorCallback(response) {

        });
    };
    function dateFormat(str) {
        var d = new Date(str);
        var newDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' ' + d.toString().split(' ')[4];
        return newDate;
    }
    $scope.submit = function () {
        $scope.form.image = $scope.files[0];
        if ($scope.itemname == '' || $scope.itemname == null) {
            alert("Please enter Item Name");
            var element = $window.document.getElementById("itemname");
            element.focus();
        } else if ($scope.price == '' || $scope.price == null) {
            alert("Please enter price");
            var element = $window.document.getElementById("price");
            element.focus();
        } else if (($scope.hidid != null) ? 0 : ($scope.form.image == '' || $scope.form.image == null)) {
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
        } else if ($scope.fromdate == '' || $scope.fromdate == null) {
            alert("Please enter offer start date");
            var element = $window.document.getElementById("fromdate");
            element.focus();
        } else if ($scope.todate == '' || $scope.todate == null) {
            alert("Please enter offer end date");
            var element = $window.document.getElementById("todate");
            element.focus();
        } else {
            $http({
                method: 'POST',
                url: 'php/offerSpecial.php?act=addofferSpecial',
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("image", $scope.form.image);
                    formData.append("itemname", $scope.itemname);
//                    formData.append("selectCategory", $scope.selectCategory.value);
                    formData.append("price", $scope.price);
                    formData.append("comment", $scope.comment);
                    formData.append("foodType", $scope.foodType);
                    formData.append("foodspicy", $scope.foodspicy);
                    formData.append("fromdate", dateFormat($scope.fromdate));
                    formData.append("todate", dateFormat($scope.todate));
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
                    $scope.foo = {};
                    $scope.foo.bar = false;
                    $('#img').val('');
                    $scope.itemname = '';
//                    $scope.selectCategory.value = '';
                    $scope.comment = '';
                    $scope.price = '';
                    $scope.foodType = '';
                    $scope.foodspicy = '';
                    $scope.fromdate = '';
                    $scope.todate = '';

                    viewItem();
                } else {
                    alert("Couldn't save, Please try again later!!!");
                }
            });
        }
    };

    $scope.cancelSave = function () {
        $scope.foo = {};
        $scope.foo.bar = false;
        $('#img').val('');
        $scope.itemname = '';
//        $scope.selectCategory.value = '';
        $scope.comment = '';
        $scope.price = '';
        $scope.foodType = '';
        $scope.foodspicy = '';
        $scope.foodspicy = '';
        $scope.fromdate = '';
        $scope.todate = '';
    };
});