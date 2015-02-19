/*
Chris Samuel
February 18 2015
app.js

this is the entry point of our angular application.

*/


angular.module('Instagram', ['ngRoute','ngMessages','satellizer'])

/*the config method above is executed during the provider
  registration and phase. You can only inject providers and
  constants into configuration blocks, $routeProvider and
  not $route.
*/
.config(function($routeProvider,$authProvider){
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


  $authProvider.loginUrl = 'http://localhost:3000/auth/login';
  $authProvider.signupUrl = 'http://localhost:3000/auth/signup';
  $authProvider.oauth2({
    name: 'instagram',
    url: 'http://localhost:3000/auth/instagram',
    redirectUri: 'http://localhost:8000',
    ClientId: '799d1f8ea0e44ac8b70e7f18fcacedd1',
    requiredUrlParams: ['scope'],
  scope: ['likes'],
  scopeDelimiter: '+',
  authorizationEndpoint: 'https://api.instagram.com/oauth/authorize'
    });
});
