/*
Chris Samuel
FEB 18 2015

home.js

this controllers will allow us to interact with a View and a Model, its the place where presentational logic can
place to keep the UI bindings in sync with the model . A controller's purpose is to drive Model and view changes,
in Angular its a meeting place between our business logic and our presentational Logic.

*/

/* Update 2015 February
  Injected new services:

  ==============================
  $window - service in module ng
  ==============================

  A reference to the browser's window object.
  While window is globally available in JavaScript,
  it causes testability problems, because it is a global variable.
  In angular we always refer to it through the $window service,
  so it may be overridden, removed or mocked for testing.


  ==================================
  $rootScope - type in module ngMock
  ==================================


  Scope type decorate with helper methods usefule for testing.
  These methods are automatically available on any Scope instance
  when ngMock module is loaded.



*/
angular.module('Instagram')
  .controller('HomeCtrl',function($scope, $window, $rootScope,$auth){
    $scope.isAuthenticated = function() {
      //check if logged in
    return $auth.isAuthenticated();
    };

  /*

  $auth service will be used to implement the isAuthenticated()
  and linkInstagram() functions.
  */

    $scope.linkInstagram = function(){
      // connect the email account with instagram
      $auth.link('instagram')
        .then(function(response){
          $window.localStorage.currentUser = JSON.stringy(response.data.user);
          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        });
    };

  });
