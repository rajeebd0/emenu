var dashboard = angular.module('Emenu');
dashboard.controller('tableController', function ($scope, $http, $state, $window, $location) {

    $scope.form = [];
    $scope.files = [];
    var element = $window.document.getElementById("tablename");
    element.focus();

    $http({
        method: 'GET',
        url: 'php/session.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        //console.log('session',response);
        $location.path('table');
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

//    $scope.uploadedFile = function (element) {
//        $scope.foo = {};
//        $scope.foo.bar = true;
//        $scope.currentFile = element.files[0];
//        var reader = new FileReader();
//        reader.onload = function (event) {
//            $scope.image_source = event.target.result
//            $scope.$apply(function ($scope) {
//                $scope.files = element.files;
//            });
//        }
//        reader.readAsDataURL(element.files[0]);
//    };


    $scope.submit = function () {
        if ($scope.tablename == '' || $scope.tablename == null) {
            alert("Please enter Table Name");
            var element = $window.document.getElementById("tablename");
            element.focus();
        } else if ($scope.type == '' || $scope.type == null) {
            alert("Please select Type");
            var element = $window.document.getElementById("type");
            element.focus();
        } else {
            $http({
                method: 'POST',
                url: 'php/table.php?act=addTable',
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("tablename", $scope.tablename);
                    formData.append("type", $scope.type);
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
                    $scope.tablename = '';
                    $scope.type = '';
                    $scope.hidid = '';
                    viewTables();
                } else {
                    alert("Couldn't save, Please try again later!!!");
                }
            });
        }
    };

    viewTables();
    function viewTables() {
        $http.get("php/table.php?act=viewTable").success(function (data) {
            $scope.tabledata = data;
        });
    }
    ;

    $scope.editTables = function (id) {
        var userData = {'id': id};
        $http({
            method: 'POST',
            url: 'php/table.php?act=getSingleTable',
            data: userData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.foo = {};
            $scope.foo.bar = true;
            $scope.tablename = response.data[0]['table_name'];
            $scope.type = response.data[0]['type'];
            $scope.hidid = response.data[0]['id'];
            var element = $window.document.getElementById("tablename");
            element.focus();
        }, function errorCallback(response) {

        });
    };

    $scope.cancelSave = function () {
        $scope.foo = {};
        $scope.foo.bar = false;
        $scope.tablename = '';
        $scope.type = '';
        $scope.hidid = '';
        var element = $window.document.getElementById("tablename");
        element.focus();
        viewTables();
    };

    $scope.deleteTables = function (id) {
        if (confirm("are you sure to delete?")) {
            var userData = {'id': id};
            $http({
                method: 'POST',
                url: 'php/table.php?act=deleteTable',
                data: userData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                if (response.data == 1) {
                    //alert("Deleted Successfully");
                    viewCategory();
                } else {
                    alert("Couldn't delete, Please try again later!!!");
                }
            }, function errorCallback(response) {

            });
        }
    };


});