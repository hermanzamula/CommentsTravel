angular.module('comments-front', ['comments-back', 'coordsForNewComment'])
    .controller('commentController', ['$scope', '$routeParams', 'CommentFind', 'CommentAdd', 'Coordinates', 'CommentRate',
        function ($scope, $routeParams, CommentFind, CommentAdd, Coordinates, CommentRate) {
            CommentFind.query({lat: $routeParams.lat, lng: $routeParams.lng},
                function (data) {
                    $scope.comments = data;
                    $scope.orderProp = '-date';
                    $scope.newComment = {rating: 0};
                    $scope.setOrderProp = function (value) {
                        $scope.orderProp = value;
                    };
                    $scope.increaseRating = function (comment) {
                        changeRating(comment, 1);
                    };

                    $scope.decreaseRating = function (comment) {
                        changeRating(comment, -1);
                    };

                    function saveRating(comment, amount) {
                        comment.rating = comment.rating + amount;
                        CommentRate.query({blog: comment._id, rating: comment.rating});
                    }

                    function changeRating(comment, amount) {
                        if (!isUserCanVote()) return;
                        var rate = localStorage[comment._id];
                        if (!rate) {
                            saveRating(comment, amount);
                            localStorage[comment._id] = amount;
                        } else if (rate != amount) {
                            saveRating(comment, amount);
                            localStorage.removeItem(comment._id);
                        }
                    }

                    $scope.addComment = function () {
                        $scope.newComment.date = new Date();
                        $scope.newComment.coords = [Coordinates.getCoords()];
                        $scope.comments.push($scope.newComment);
                        CommentAdd.query($scope.newComment);
                        $scope.newComment = {rating: 0};
                        return false;
                    };
                }

            )
            ;
        }
    ])
;

function isUserCanVote() {
    return (typeof (Storage) !== "undefined"); // check browser for supporting local storage
}
