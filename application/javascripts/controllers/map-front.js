angular.module("map-front", ['map-back', 'comments-back', 'coordsForNewComment'])
    .controller("map-controller", ['$scope', '$location', '$http', '$timeout', '$log', 'Location', 'Coordinates', 'CommentMapped',
        function ($scope, $location, $http, $timeout, $log, Location, Coordinates, CommentMapped) {
            function updateMarkers() {
                CommentMapped.query(function (data) {
                    $scope.map.markers = convertToMarkers(data);
                    $scope.cursor = {
                        latitude: $scope.map.latitude,
                        longitude: $scope.map.longitude,
                        title: "Your",
                        onClicked: onMarkerClicked};

                    $scope.map.markers.push($scope.cursor);
                });
            }

            var onMarkerClicked = function () {
                $location.path("/comment/" + this.latitude + "/" + this.longitude);
                Coordinates.setCoords(this.latitude, this.longitude);
                $scope.markerDetails.show();
            };

            function convertToMarkers(data) {
                var markersWithComments = [];
                var i = data.length - 1;
                while (i >= 0) {
                    var area = data[i];
                    markersWithComments.push({
                        latitude: area.coords.lat,
                        longitude: area.coords.lng,
                        title: "Comments: " + area.blogs,
                        onClicked: onMarkerClicked});
                    i--;
                }
                return markersWithComments;
            }

            // Enable the new Google Maps visuals until it gets enabled by default.
            // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
            google.maps.visualRefresh = true;

            $scope.address = 'Kharkiv';
            $scope.language = 'en';


            //get data from google
            $scope.locationData = Location.getLocation({
                address: $scope.address,
                language: $scope.language
            });

            //set coords by default
            $scope.location = {};
            $scope.location.lat = 50;
            $scope.location.lng = 30;

            $scope.$watch("locationData", function (oldVal, newVal) {
                //set coords using google API
                if ($scope.locationData.results) {
                    $scope.location = $scope.locationData.results[0].geometry.location;
                    $scope.position.coords.latitude = $scope.location.lat;
                    $scope.position.coords.longitude = $scope.location.lng;
                }
            });

            angular.extend($scope, {
                map: {
                    center: {
                        latitude: $scope.location.lat,
                        longitude: $scope.location.lng
                    },
                    zoom: 5,
                    dragging: false,
                    bounds: {},
                    options: {
                        streetViewControl: false,
                        panControl: false
                    },
                    latitude: 16,
                    longitude: 16,
                    markers: [],

                    events: {
                        click: function (mapModel, eventName, originalEventArgs) {
                            // 'this' is the directive's scope
                            $log.log("user defined event: " + eventName, mapModel, originalEventArgs);
                            var e = originalEventArgs[0];
                            $scope.cursor.latitude = e.latLng.lat();
                            $scope.cursor.longitude = e.latLng.lng();
                            Coordinates.setCoords(e.latLng.lat(), e.latLng.lng());
                            $scope.$apply();
                        }
                    }
                }
            });
            $scope.markerDetails = new DetailsPopUp('#markerDetails', updateMarkers);
            updateMarkers();

        }]
    );

var DetailsPopUp = function (selector, onClose) {
    this.selector = selector;
    this.onClose = onClose;
};

DetailsPopUp.prototype.show = function(){
    $(this.selector).show();
};

DetailsPopUp.prototype.hide = function(){
    $(this.selector).hide();
    this.onClose();
};


