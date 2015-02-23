/*
* Chris Samuel
* ksamuel.chris@gmail.com
* February 20 2015
*
* description:
*
* The main purpose of this service is too abstract the http requests
* this is just one of the many benefits of separating the concerns of our app.
*
*
*
*
* */


angular.module('Instagram')
    .factory('API',function($http){
        return{
            getFeed: function(){
                return $http.get('http://localhost:3000/api/feed');
                },
            getMediaById: function(id){
                return $http.get('http://localhost:3000/api/media/' + id);
            },
            likeMedia: function(id){
                return $http.get('http://localhost:3000/api/like/' + id, {mediaId:id});

            }
        }
    });