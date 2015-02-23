/*
* Chris Samuel
* February 20 2015
* ksamuel.chris@gmail.com
*
*
*Implementation inspired by Sahat Yalkabov's Satellizer
*
*https://github.com/sahat/satellizer/
*
*from Sahat's satellizer $auth.signup() method just simply takes an object and sendsit to the server without
 * doing anything to it. Thats cause what you pass here is what you will get at /auth/signup route
  *
  * if you are ever interested in changing the url to a different endpoint name you can easily override the signup URL
  *
*       =======================================
*        |$authProvider.signUrl = '/register'|
*       =======================================
*
* */




angular.module('Instagram')
    .controller('SignupCtrl',function($scope, $auth){

        $scope.signup = function(){
            var user = {
                email: $scope.email,
                password:$scope.password
            };

            //Satellizer
            $auth.signup(user)
                .catch(function(response){
                    console.log(response.data);


                });
        };

    });





