/*
* Chris Samuel
* February 20 2015
* ksamuel.chris@gmail.com
*
* serverError.js
*
* The purpose of thi script is to clear error messages such as Invalid Username or Password and
* reset the form validity whenever user starts typing again. Otherwise, after you get an error message
* back from the server you will not be able to re-submit the form with the current implementation.
*
*
* */

angular.module('Instagram')
    .directive('serverError', function(){
        return{
            restrict: 'A',
            require: 'ngModel',
            link:function(scope,element,attrs,ctrl) {
                element.on('keydown', function(){
                    ctrl.$setValidity(server,true)
                });
            }
        }
    });