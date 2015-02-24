/*
* Chris Samuel
* ksamuel.chris@gmail.com
* February 24 2015
*
* detail.js main responsibilities are to handle  the <em>Like</em> action and fetch media data.
* */



angular.module('Instagram')
.controller('DetailCtrl', function($scope,$rootScope,$location,API){

        //take the media Id from URL path
        var mediaId = $location.path().split('/').pop();

        //and pass it to API.getMediaById function
        API.getMediaById(mediaId).success(function(media){
            $scope.hasLiked = media.user_has_liked;
            $scope.photo = media;
        });

        //second method scope.hasLike when set to true will make  all the hearts red and update the text
        //from like to Liked.
        $scope.like = function() {
            $scope.hasLiked = true;
            API.likeMEdia(mediaId).error(function(data){
                sweetAlert('Error',data.message,'error');
            });
        };

    });