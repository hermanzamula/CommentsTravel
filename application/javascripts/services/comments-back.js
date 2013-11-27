angular.module("comments-back", ["ngResource"])
    .factory("Comment", function($resource) {
        return $resource('/api/findAll',{},{
            query:{method: 'GET', isArray: true}}
        );
    });
