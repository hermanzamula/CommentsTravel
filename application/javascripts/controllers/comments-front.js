angular.module('comments-front', [])
    .controller('commentController', ['$scope', '$http', function ($scope, $http) {
    $http.get('../testData.json').success(function (data) {
        $scope.comments = data;
    });
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
        $scope.comments.push($scope.newComment);
        $scope.newComment = {rating: 0};
        return false;
    };

}
]);

