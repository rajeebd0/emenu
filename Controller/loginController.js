var loginAdmin = angular.module('Emenu');
loginAdmin.controller('loginController', function ($scope, $http, $location, $window, $state) {
    //console.log('hii');

    $scope.adminLogin = function () {
        if ($scope.u_name == null || $scope.u_name == '') {
            $scope.validateMessage = true;
            alert("Please Enter Login Id");
            $scope.setFocus = function () {
                var element = $window.document.getElementById("username");
                element.focus();
            };
        } else if ($scope.u_password == null || $scope.u_password == '') {
            $scope.validateMessage = true;
            alert("Please Enter Password");
            $scope.setFocus = function () {
                var element = $window.document.getElementById("pwd");
                element.focus();
            };
        } else {
            var userData = {'u_name': $scope.u_name, 'u_password': $scope.u_password};
            $http({
                method: 'POST',
                url: "php/login.php",
                data: userData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                //console.log('login',response);
                if (response.data['id'] == '1') {
                    $location.path('registration');
                }

            }, function errorCallback(response) {
                if (response.data['msg'].length > 0) {
                    alert(response.data['msg']);
                    $scope.u_name = null;
                    $scope.u_password = null;
                }
            });
        }
    };

    $scope.logindata = function (keyEvent) {
        if (keyEvent.which === 13) {
            $scope.adminLogin()
        }
    };
});
