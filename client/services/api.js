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
* front end dropbox url : https://dl.dropboxusercontent.com/u/23926370/instagram/index.html
*   Back-end heroku url : http://daitanrou-smashbros-2536.herokuapp.com/
*
* */


angular.module('Instagram')
    .factory('API',function($http){
        return{
            getFeed: function(){
                return $http.get('http://daitanrou-smashbros-2536.herokuapp.com/api/feed');
                },
            getMediaById: function(id){
                return $http.get('http://daitanrou-smashbros-2536.herokuapp.com/api/media/' + id);
            },
            likeMedia: function(id){
                return $http.get('http://daitanrou-smashbros-2536.herokuapp.com/api/like/' + id, {mediaId:id});

            }
        }
    });