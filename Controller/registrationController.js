var dashboard = angular.module('Emenu');
dashboard.controller('registrationController', function ($scope, $http, $state, $window, $location) {

    $scope.form = [];
    $scope.files = [];
    var element = $window.document.getElementById("tabname");
    element.focus();

    $http({
        method: 'GET',
        url: 'php/session.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        //console.log('session',response);
        $location.path('registration');
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


    $scope.submit = function () {
        $scope.form.image = $scope.files[0];
        if ($scope.tabname == '' || $scope.tabname == null) {
            alert("Please enter Tab Name");
            var element = $window.document.getElementById("tabname");
            element.focus();
        } else if ($scope.tabid == '' || $scope.tabid == null) {
            alert("Please enter Tab ID");
            var element = $window.document.getElementById("tabid");
            element.focus();
        } else if ($scope.status == '' || $scope.status == null) {
            alert("Please select Status");
            var element = $window.document.getElementById("status");
            element.focus();
        } else if ($scope.hidid == '' && ($scope.form.image == '' || $scope.form.image == null)) {
//            alert("Please upload Category Image");
            var element = $window.document.getElementById("img");
            element.focus();
        } else {
            $http({
                method: 'POST',
                url: 'php/registration.php?act=addTab',
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("tabname", $scope.tabname);
                    formData.append("tabid", $scope.tabid);
                    formData.append("status", $scope.status);
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
                    $scope.tabname = '';
                    $scope.tabid = '';
                    $scope.status = '1';
                    viewTab();
                } else {
                    alert("Couldn't save, Please try again later!!!");
                }
            });
        }
    };

    viewTab();
    function viewTab() {
        $http.get("php/registration.php?act=viewTab").success(function (data) {
            $scope.tabdata = data;
        });
    }
    ;

    $scope.editTab = function (id) {
        var userData = {'id': id};
        $http({
            method: 'POST',
            url: 'php/registration.php?act=getSingleTab',
            data: userData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.tabname = response.data[0]['devicename'];
            $scope.tabid = response.data[0]['deviceid'];
            $scope.status = response.data[0]['status'];
            $scope.hidid = response.data[0]['id'];
            $scope.foo = {};
            $scope.foo.bar = true;
            var element = $window.document.getElementById("tabname");
            element.focus();
        }, function errorCallback(response) {

        });
    };

    $scope.cancelSave = function () {
        $scope.foo = {};
        $scope.foo.bar = false;
//        $('#img').val('');
        $scope.tabname = '';
        $scope.tabid = '';
        $scope.status = '1';
        var element = $window.document.getElementById("tabname");
        element.focus();
        viewTab();
    };

    $scope.deleteTab = function (id) {
        if (confirm("are you sure to delete?")) {
            var userData = {'id': id};
            $http({
                method: 'POST',
                url: 'php/registration.php?act=deleteTab',
                data: userData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                if (response.data == 1) {
                    //alert("Deleted Successfully");
                    viewTab();
                } else {
                    alert("Couldn't delete, Please try again later!!!");
                }
            }, function errorCallback(response) {

            });
        }
    };


});