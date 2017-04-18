var Admin = angular.module('Emenu', ['ui.router', 'ui.bootstrap.datetimepicker']);
Admin.run(function ($rootScope, $state) {
    $rootScope.$state = $state;
});
Admin.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
            .state('/', {/*....This state defines All type of user login...*/
                url: '/',
                templateUrl: 'View/login.html',
                controller: 'loginController'
            })
            .state('category', {
                url: '/category',
                templateUrl: 'View/category.html',
                controller: 'categoryController'
            })
            .state('offerSpecial', {
                url: '/offerSpecial',
                templateUrl: 'View/offerspecial.html',
                controller: 'offerSpecialController'
            })
            .state('setting', {
                url: '/setting',
                templateUrl: 'View/setting.html',
                controller: 'settingController'
            })
            .state('menuItem', {
                url: '/menuItem',
                templateUrl: 'View/menuitem.html',
                controller: 'menuItemController'
            })
            .state('newOrder', {
                url: '/newOrder',
                templateUrl: 'View/neworder.html',
                controller: 'newOrderController'
            })
            .state('pastOrder', {
                url: '/pastOrder',
                templateUrl: 'View/pastorder.html',
                controller: 'pastOrderController'
            })
            .state('table', {
                url: '/table',
                templateUrl: 'View/table.html',
                controller: 'tableController'
            })
            .state('waiter', {
                url: '/waiter',
                templateUrl: 'View/waiter.html',
                controller: 'waiterController'
            })
            .state('chef', {
                url: '/chef',
                templateUrl: 'View/chef.html',
                controller: 'chefController'
            })
            .state('registration', {
                url: '/registration',
                templateUrl: 'View/registration.html',
                controller: 'registrationController'
            })
            .state('customer', {
                url: '/customer',
                templateUrl: 'View/customer.html',
                controller: 'customerController'
            })
            .state('viewCustomerFeedback', {
                url: '/viewCustomerFeedback',
                templateUrl: 'View/viewCustomerFeedback.html',
                controller: 'viewCustomerFeedbackController'
            })
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
});
Admin.directive('dateParser', dateParser);
function dateParser() {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link,
    };

    function link(scope, element, attrs, ngModel) {
        var moment = window.moment,
                dateFormat = attrs.dateParser,
                alternativeFormat = dateFormat.replace('DD', 'D').replace('MM', 'M'); //alternative do accept days and months with a single digit

        //use push to make sure our parser will be the last to run
        ngModel.$formatters.push(formatter);
        ngModel.$parsers.push(parser);

        function parser(viewValue) {
            var value = ngModel.$viewValue; //value that none of the parsers touched
            if (value) {
                var date = moment(value, [dateFormat, alternativeFormat], true);
                ngModel.$setValidity('date', date.isValid());
                return date.isValid() ? date._d : value;
            }

            return value;
        }

        function formatter(value) {
            var m = moment(value);
            var valid = m.isValid();
            if (valid)
                return m.format(dateFormat);
            else
                return value;
        }
    }
}
