var dashboard = angular.module('Emenu');
dashboard.controller('customerController', function ($scope, $http, $state, $window, $location) {

    $scope.form = [];
    $scope.discount_valid = '';
    $http({
        method: 'GET',
        url: 'php/session.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        //console.log('session',response);
        $location.path('customer');
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
    }


    viewCustomer();
    function viewCustomer() {
        $http.get("php/customer.php?act=viewCustomer").success(function (data) {
            $scope.customerdata = data;
        });
    }
    ;

    $scope.deleteCustomer = function (id) {
        if (confirm("are you sure to delete?")) {
            var userData = {'id': id};
            $http({
                method: 'POST',
                url: 'php/customer.php?act=deleteCustomer',
                data: userData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                if (response.data == 1) {
                    //alert("Deleted Successfully");
                    viewCustomer();
                } else {
                    alert("Couldn't delete, Please try again later!!!");
                }
            }, function errorCallback(response) {

            });
        }
    };

    $scope.editCustomer = function (id) {
        var userData = {'id': id};
        $http({
            method: 'POST',
            url: 'php/customer.php?act=editCustomer',
            data: userData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.foo = {};
            $scope.foo.bar = true;
            $scope.customer_email = response.data[0]['customer_email'];
            $scope.customer_name = response.data[0]['customer_name'];
            $scope.mobile = response.data[0]['mobile'];
            $scope.discount = response.data[0]['discount'];
            $scope.discount_valid = response.data[0]['discount_valid'];
            $scope.hidid = response.data[0]['id'];
        }, function errorCallback(response) {

        });
    };
    function dateFormat(str) {
        var d = new Date(str);
        var newDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ' ' + d.toString().split(' ')[4];
        return newDate;
    }
    $scope.submit = function () {
//        $scope.form.image = $scope.files[0];
        if ($scope.customer_name == '' || $scope.customer_name == null) {
            alert("Please enter Customer Name");
            var element = $window.document.getElementById("customer_name");
            element.focus();
        } else if ($scope.customer_email == '' || $scope.customer_email == null) {
            alert("Please enter Customer Email");
            var element = $window.document.getElementById("customer_email");
            element.focus();
        } else if ($scope.mobile == '' || $scope.mobile == null) {
            alert("Please enter Customer Mobile");
            var element = $window.document.getElementById("mobile");
            element.focus();
        } else if ($scope.discount_valid == '' || $scope.discount_valid == null) {
            alert("Please enter Discount Validity Date");
            var element = $window.document.getElementById("discount_valid");
            element.focus();
        } else if ($scope.discount == '' || $scope.discount == null) {
            alert("Please enter Discount In percentage");
            var element = $window.document.getElementById("discount");
            element.focus();
        } else {
            $http({
                method: 'POST',
                url: 'php/customer.php?act=addCustomer',
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("customer_name", $scope.customer_name);
                    formData.append("customer_email", $scope.customer_email);
                    formData.append("mobile", $scope.mobile);
                    formData.append("discount_valid", dateFormat($scope.discount_valid));
                    formData.append("discount", $scope.discount);
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
                    $scope.customer_name = '';
                    $scope.customer_email = '';
                    $scope.mobile = '';
                    $scope.discount_valid = '';
                    $scope.discount = '';
                    $scope.hidid = '';
                    viewCustomer();
                } else if (data.err) {
                    alert(data.msg);
                } else {
                    alert("Couldn't save, Please try again later!!!");
                }
            });
        }
    };

    $scope.cancelSave = function () {
        $scope.foo = {};
        $scope.foo.bar = false;
        $scope.customer_name = '';
        $scope.customer_email = '';
        $scope.mobile = '';
        $scope.discount_valid = '';
        $scope.discount = '';
        $scope.hidid = '';
    };


});