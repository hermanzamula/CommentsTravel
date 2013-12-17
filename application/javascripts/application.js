var commentsApp = angular.module("travel-comments",[
    "google-maps",
    "map-front",
    'ngRoute',
    'comments-front']);

commentsApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/comment/:lat/:lng', {
                templateUrl: 'pages/comment.html',
                controller: 'commentController'
            })
    }]);