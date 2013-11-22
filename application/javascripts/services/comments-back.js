angular.module("comments-back", ["ngResource"])
    .factory("Comments", function($resource) {
         return $resource("../comments")
    })
