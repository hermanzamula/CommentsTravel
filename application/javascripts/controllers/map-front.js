angular.module("map-front", ['map-back', 'comments-back', 'coordsForNewComment', 'markers-list'])
    .controller("map-controller", [
        '$scope',
        '$rootScope',
        '$location',
        '$http',
        '$timeout',
        '$log',
        'Location',
        'Coordinates',
        'CommentMapped',
        'Markers',
        function (
            $scope,
            $rootScope,
            $location,
            $http,
            $timeout,
            $log,
            Location,
            Coordinates,
            CommentMapped,
            Markers
            ) {

            function updateMarkers() {
                CommentMapped.query(function (data) {
                    var cursor = {
                        latitude: $scope.map.latitude,
                        longitude: $scope.map.longitude,
                        title: "Your"
                    };

                    Markers.addMarkers(cursor, onMarkerClicked);

                    //add markers from database
                    Markers.addMarkers(convertToMarkers(data), onMarkerClicked);

                    $scope.map.markers = Markers.getMarkers();
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
                        });
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
            $scope.location = {
                latitude: 50,
                longitude: 30
            };

            $scope.$watch("locationData", function (oldVal, newVal) {
                //set coords using google API
                if ($scope.locationData.results) {
                    $scope.location = $scope.locationData.results[0].geometry.location;
                    $scope.position.coords.latitude = $scope.location.latitude;
                    $scope.position.coords.longitude = $scope.location.longitude;
                }
            });

            var testMarkersData = [
                {
                    latitude: 45,
                    longitude: 34,
                    showWindow: false,
                    title: 'Marker 2'
                },
                {
                    latitude: 15,
                    longitude: 30,
                    showWindow: false,
                    title: 'Marker 2'
                },
                {
                    //icon: 'plane.png',
                    latitude: 37,
                    longitude: 72,
                    showWindow: false,
                    title: 'Plane'
                }
            ];
            Markers.addMarkers(testMarkersData, onMarkerClicked);


            angular.extend($scope, {
                map: {
                    center: $scope.location,
                    zoom: 5,
                    dragging: false,
                    bounds: {},
                    options: {
                        streetViewControl: false,
                        panControl: false
                    },
                    latitude: 16,
                    longitude: 16,
                    markers: Markers.getMarkers(),

                    events: {
                        click: function (mapModel, eventName, originalEventArgs) {
                            // 'this' is the directive's scope
                            $log.log("user defined event: " + eventName, mapModel, originalEventArgs);
                            var e = originalEventArgs[0];
                           /*
                            $scope.cursor.latitude = e.latLng.lat();
                            $scope.cursor.longitude = e.latLng.lng();
                            Coordinates.setCoords(e.latLng.lat(), e.latLng.lng());
                            $scope.$apply();
                            */
                            var markerData = {
                                latitude: e.latLng.lat(),
                                longitude: e.latLng.lng(),
                                title: "My marker"
                            };

                            Markers.addMarkers(markerData, onMarkerClicked);

                            $scope.$apply();
                            // Todo: add event onClick to the map
                        }
                    }
                }
            });
            $scope.markerDetails = new DetailsPopUp('#markerDetails', updateMarkers);
            //updateMarkers();

            $scope.$on('addMarker', function (event, markerData) {
                console.log(markerData);
                Markers.addMarkers(markerData, onMarkerClicked);
            });

        }]
    )
    .directive('autocomplete', ['$timeout', "$rootScope", function ($timeout, $rootScope) {

        var createInput = function (map) {
            var input = document.createElement("input");
            input.type = "text";
            input.className = "angular-google-map-autocomplete";
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
            return input;
        };

        return {
            restrict: 'E',
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
                            $rootScope.$broadcast('addMarker', marker);

                        } else {
                            console.log("Cannot find this place: " + place.name); //Todo: add message
                        }
                    });
                });
            }
        }
    }])

var DetailsPopUp = function (selector, onClose) {
    this.selector = selector;
    //this.onClose = onClose;
};

DetailsPopUp.prototype.show = function () {
    $(this.selector).show();
};

DetailsPopUp.prototype.hide = function () {
    $(this.selector).hide();
    //this.onClose();
};


