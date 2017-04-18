var dashboard = angular.module('Emenu');
dashboard.controller('chefController', function ($scope, $http, $state, $window, $location) {

    $scope.form = [];
    $scope.files = [];
    var element = $window.document.getElementById("categoryname");
    element.focus();

    $http({
        method: 'GET',
        url: 'php/session.php',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function successCallback(response) {
        //console.log('session',response);
        $location.path('chef');
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
        if ($scope.categoryname == '' || $scope.categoryname == null) {
            alert("Please enter Category Name");
            var element = $window.document.getElementById("categoryname");
            element.focus();
        } else if ($scope.type == '' || $scope.type == null) {
            alert("Please select Type");
            var element = $window.document.getElementById("type");
            element.focus();
        } else if ($scope.hidid == '' && ($scope.form.image == '' || $scope.form.image == null)) {
            alert("Please upload Category Image");
            var element = $window.document.getElementById("img");
            element.focus();
        } else {
            $http({
                method: 'POST',
                url: 'php/category.php?act=addCategory',
                processData: false,
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("image", $scope.form.image);
                    formData.append("categoryname", $scope.categoryname);
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
                    $scope.foo.bar = false;
                    $('#img').val('');
                    $scope.categoryname = '';
                    $scope.type = '';
                    viewCategory();
                } else {
                    alert("Couldn't save, Please try again later!!!");
                }
            });
        }
    };

    viewCategory();
    function viewCategory() {
        $http.get("php/category.php?act=viewCategory").success(function (data) {
            $scope.categorydata = data;
        });
    }
    ;

    $scope.editCategory = function (id) {
        var userData = {'id': id};
        $http({
            method: 'POST',
            url: 'php/category.php?act=getSingleCategory',
            data: userData,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.categoryname = response.data[0]['name'];
            $scope.type = response.data[0]['type'];
            $scope.imagefile = response.data[0]['image'];
            $scope.hidid = response.data[0]['id'];
            $scope.foo = {};
            $scope.foo.bar = true;
            $scope.image_source = 'categoryImage/' + response.data[0]['image'];
            var element = $window.document.getElementById("categoryname");
            element.focus();
        }, function errorCallback(response) {

        });
    };

    $scope.cancelSave = function () {
        $scope.foo = {};
        $scope.foo.bar = false;
        $('#img').val('');
        $scope.categoryname = '';
        $scope.type = '';
        var element = $window.document.getElementById("categoryname");
        element.focus();
        viewCategory();
    };

    $scope.deleteCategory = function (id) {
        if (confirm("are you sure to delete?")) {
            var userData = {'id': id};
            $http({
                method: 'POST',
                url: 'php/category.php?act=deleteCategory',
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