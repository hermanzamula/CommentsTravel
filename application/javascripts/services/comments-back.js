angular.module("comments-back", ["ngResource"])
    .factory('CommentFind', function ($resource) {
        return $resource('api/blogs/:lat/:lng', {}, {
            query: {method: 'GET', isArray: true}
        });
    })
    .factory("CommentMapped", function ($resource) {
        return $resource('/api/blogsMapped', {}, {
                query: {method: 'GET', isArray: true}}
        );
    })
    .factory("CommentsMappedScaled", function ($resource) {
        return $resource('/api/blogsMappedScaled');
    })
    .factory("CommentAdd", function ($resource) {
        return $resource('/api/blogs', {}, {
                query: {method: 'POST', isArray: false}}
        );
    })
    .factory("CommentRate", function ($resource) {
        return $resource('/api/blogs/rate/:blog/:rating', {}, {
                query: {method: 'GET', isArray: false}}
        );
    });

//    .factory('Comment', function ($resource) {
//        return $resource('../api/comments/:blog', {}, {
//            'find': {method: 'GET', isArray: true},
//            'addComment': {method: 'POST' }
//        });
//    });
