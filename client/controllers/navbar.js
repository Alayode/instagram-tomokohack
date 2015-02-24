/*
* Chris Samuel
* ksamuel.chris@gmail.com
* February 24 2015
*
* this navbar.js will be handling the logoutaction,
* when a user login/signup the users links will hide/show the corresponding links when authenticated
*
*
*
* */





angular.module('Instagram')
    .controller('NavbarCtrl', function($scope, $rootScope, $window, $auth) {
        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        $scope.logout = function() {
            $auth.logout();
            delete $window.localStorage.currentUser;
        };
    });
