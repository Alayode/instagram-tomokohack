angular.module('Instagram', ['ngRoute', 'ngMessages', 'satellizer'])
  .config(function($routeProvider, $authProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl'
            })
            .when('/photo/:id', {
                templateUrl: 'views/detail.html',
                controller: 'DetailCtrl'
            })
            .otherwise('/');

        $authProvider.loginUrl = 'http://daitanrou-smashbros-2536.herokuapp.com/auth/login';
        $authProvider.signupUrl = 'http://daitanrou-smashbros-2536.herokuapp.com/auth/signup';
        $authProvider.oauth2({
            name: 'instagram',
            url: 'http://daitanrou-smashbros-2536.herokuapp.com/auth/instagram',
            redirectUri: 'http://daitanrou-smashbros-2536.herokuapp.com',
            clientId: 'be53d1c7f8e14f0ba14129c9c4690729',
            requiredUrlParams: ['scope'],
            scope: ['likes'],
            scopeDelimiter: '+',
            authorizationEndpoint: 'https://api.instagram.com/oauth/authorize'
        })
    })
            .run(function($rootScope, $window, $auth) {
    if ($auth.isAuthenticated()) {
      $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    }
  });
