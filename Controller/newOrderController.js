var dashboard = angular.module('Emenu');
dashboard.controller('newOrderController', function ($scope, $http, $state, $window, $location) {

    $scope.form = [];
    $scope.files = [];
    
    $http({
        method: 'GET',
        url: 'php/session.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        //console.log('session',response);
        $location.path('newOrder');
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


    viewOrder();
    function viewOrder() {
        $http.get("php/order.php?act=newOrder").success(function (data) {
            $scope.orderdata = data;
        });
    }
    ;


});