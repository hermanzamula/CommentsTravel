
angular.module('comments-front', []).controller('commentController', ['$scope', '$http', function($scope, $http){
    $http.get('../testData.json').success(function(data){
        $scope.comments = data;
    });
    $scope.orderProp='date';
}
]);

