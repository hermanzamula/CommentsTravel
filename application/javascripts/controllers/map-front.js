angular.module("map-front", ['map-back', 'comments-back', 'coordsForNewComment'])
    .controller("map-controller", ['$scope', '$rootScope', '$location', '$http', '$timeout', '$log', 'Location', 'Coordinates', 'CommentMapped', 'CommentsMappedScaled',
        function ($scope, $rootScope, $location, $http, $timeout, $log, Location, Coordinates, CommentMapped, CommentsMappedScaled) {

            function updateMarkers() {
                var leftCorner = {
                    latitude: $scope.map.latitude,
                    longitude: $scope.map.longitude
                };
                CommentsMappedScaled.query({
                    lat: Coordinates.getCoords().center.lat,
                    lng: Coordinates.getCoords().center.lng,
                    radius: Coordinates.getRadius()/*,
                     limit: limit*/
                }, function (data) {
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
                $scope.markerDetails.commentsCount = this.commentsCount;
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
                        commentsCount: area.blogs,
                        onClicked: onMarkerClicked});
                    i--;
                }
                return markersWithComments;
            }

            // Enable the new Google Maps visuals until it gets enabled by default.
            // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
            google.maps.visualRefresh = true;

            $scope.addNewPlace = false;
            $scope.changeAddNewPlace = function () {
                if (!$scope.addNewPlace) {
                    $scope.addNewPlace = true;
                }
            };

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
                            if ($scope.addNewPlace) {
                                // 'this' is the directive's scope
                                $log.log("user defined event: " + eventName, mapModel, originalEventArgs);
                                var e = originalEventArgs[0];
                                $scope.cursor.latitude = e.latLng.lat();
                                $scope.cursor.longitude = e.latLng.lng();
                                Coordinates.setCoords(e.latLng.lat(), e.latLng.lng());
                                $scope.$apply();
                                $scope.addNewPlace = false;
                            }
                        },
                        'bounds_changed': function (mapModel, eventName, originalEventArgs) {

                            var center = mapModel.getCenter();
                            var northEast = mapModel.getBounds().getNorthEast();
                            var southWest = mapModel.getBounds().getSouthWest();
                            Coordinates.setCenter(center.lat(), center.lng());
                            Coordinates.setLeftCorner(northEast.lat(), northEast.lng());
                            Coordinates.setRightCorner(southWest.lat(), southWest.lng());
                        }
                    }
                }
            });

            Coordinates.setCenter($scope.map.center.latitude, $scope.map.center.longitude);
            Coordinates.setLeftCorner($scope.map.latitude, $scope.map.longitude);

            $scope.markerDetails = new DetailsPopUp('#markerDetails', updateMarkers);
            updateMarkers();


            var addMarker = function (marker) {
                if (marker && marker.latitude && marker.longitude && marker.title) {
                    if (!marker.onClicked) {
                        marker.onClicked = onMarkerClicked;  //Todo: find a better way to add onClick event
                    }
                    $scope.map.markers.push(marker);
                }

            };

            $rootScope.$on('addMarker', function (event, marker) {
                addMarker(marker);
            });

        }]
    )
    .directive('autocomplete', ['$timeout', function ($timeout) {

        var createInput = function (map) {
            var input = document.createElement("input");
            input.type = "text";
            input.className = "angular-google-map-autocomplete";
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            return input;
        };

        return {
            restrict: 'E',
            templateUrl: '',
            transclude: true,
            require: '^googleMap',
            link: function (scope, element, attrs, mapCtrl) {
                $timeout(function () {
                    var map = mapCtrl.getMap();
                    var input = createInput(map);
                    var autocomplete = new google.maps.places.Autocomplete(input);
                    autocomplete.bindTo('bounds', map);

                    google.maps.event.addListener(autocomplete, 'place_changed', function () {
                        var place = autocomplete.getPlace();

                        if (place && place.geometry) {
                            if (place.geometry.viewport) {
                                map.fitBounds(place.geometry.viewport);
                            } else {
                                map.setCenter(place.geometry.location);
                                map.setZoom(17);  // Why 17? Because it looks good.

                            }
                            var marker = {
                                latitude: place.geometry.location.nb,
                                longitude: place.geometry.location.ob,
                                showWindow: false,
                                title: place.formatted_address
                            };


                            scope.$emit('addMarker', marker);

                        } else {
                            console.log("Cannot find this place: " + place.name); //Todo: add message
                        }
                    });
                });
            }
        }
    }]);

var DetailsPopUp = function (selector, onClose) {
    this.selector = selector;
    this.onClose = onClose;
};

DetailsPopUp.prototype.show = function () {
    $(this.selector).show();
};

DetailsPopUp.prototype.hide = function () {
    $(this.selector).hide();
    this.onClose();
};


