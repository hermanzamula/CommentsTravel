angular.module('comments-front', ['comments-back', 'coordsForNewComment'])
    .controller('commentController', ['$scope', '$routeParams', 'CommentFind', 'CommentAdd', 'Coordinates',
        function ($scope, $routeParams, CommentFind, CommentAdd, Coordinates) {
            CommentFind.query({lat: $routeParams.lat, lng: $routeParams.lng}, function (data) {
                $scope.comments = data;
                $scope.orderProp = '-date';
                $scope.newComment = {rating: 0};
                $scope.setOrderProp = function (value) {
                    $scope.orderProp = value;
                };
                $scope.increaseRating = function (comment) {
                    comment.rating = comment.rating + 1;
                };

                $scope.decreaseRating = function (comment) {
                    comment.rating = comment.rating - 1;
                };

                $scope.addComment = function () {
                    $scope.newComment.date = new Date();
                    $scope.newComment.coords = [Coordinates.getCoords()];
                    $scope.comments.push($scope.newComment);
                    CommentAdd.query($scope.newComment);
                    $scope.newComment = {rating: 0};
                    return false;
                };
            });
        }
    ]);

