var dashboard = angular.module('Emenu');
dashboard.controller('settingController', function ($scope, $http, $state, $window, $location) {
    var element = $window.document.getElementById("restaurantname");
    element.focus();
    $scope.form = [];
    $scope.files = [];
    $http({
        method: 'GET',
        url: 'php/session.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        //console.log('session',response);
        $location.path('setting');
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

    viewSetting();
    function viewSetting() {
        $http.get("php/setting.php?act=viewSetting").success(function (data) {
//            console.log('data', data);
            $scope.restaurantname = data[0]['name'];
            $scope.restaurantcode = data[0]['restaurant_code'];
            $scope.loginid = data[0]['loginid'];
            $scope.pwd = '';
            $scope.slogan = data[0]['slogan'];
            $scope.comment = data[0]['description'];
            $scope.image_source = 'profileImage/' + data[0]['image'];
            $scope.hidid = data[0]['id'];
            $scope.foo = {};
            $scope.foo.bar = true;
            var element = $window.document.getElementById("tabname");
            element.focus();
        });
    }
    ;

    $scope.filterValue = function ($event) {
        if (isNaN(String.fromCharCode($event.keyCode))) {
            $event.preventDefault();
        }
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


    $scope.submit = function () {
        $scope.form.image = $scope.files[0];
        if ($scope.restaurantname == '' || $scope.restaurantname == null) {
            alert("Please enter Restaurant Name");
            var element = $window.document.getElementById("restaurantname");
            element.focus();
        } else if ($scope.loginid == '' || $scope.loginid == null) {
            alert("Please enter Login Id");
            var element = $window.document.getElementById("loginid");
            element.focus();
        } else if ($scope.pwd == '' || $scope.pwd == null) {
            alert("Please enter Password");
            var element = $window.document.getElementById("pwd");
            element.focus();
        }  else {
            $http({
                method: 'POST',
                url: 'php/setting.php?act=addSetting',
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("image", $scope.form.image);
                    formData.append("restaurantname", $scope.restaurantname);
                    formData.append("loginid", $scope.loginid);
                    formData.append("pwd", $scope.pwd);
                    formData.append("comment", $scope.comment);
                    formData.append("slogan", $scope.slogan);
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
                    viewSetting();
                } else {
                    alert("Couldn't save, Please try again later!!!");
                }
            });
        }
    };
 
});