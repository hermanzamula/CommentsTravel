angular.module("map-front", ['map-back'])
    .controller("map-controller", ['$scope', '$http', '$timeout', '$log', 'Location', function ($scope, $http, $timeout, $log, Location) {


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
            console.log($scope.location);
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
                latitude: 15,
                longitude: 15,
                markers: [
                    {
                        latitude: 50.45,
                        longitude: 30.52
                    },
                    {
                        latitude: $scope.location.lat,
                        longitude: $scope.location.lng
                    },
                    {
                        latitude: 51,
                        longitude: 38
                    },
                    {
                        latitude: 52,
                        longitude: 26
                    }
                ],

                events: {
                    click: function (mapModel, eventName, originalEventArgs) {
                        // 'this' is the directive's scope
                        $log.log("user defined event: " + eventName, mapModel, originalEventArgs);

                        var e = originalEventArgs[0];

                        if (!$scope.map.clickedMarker) {
                            $scope.map.clickedMarker = {
                                title: 'You clicked here',
                                latitude: e.latLng.lat(),
                                longitude: e.latLng.lng()
                            };
                        }
                        else {
                            $scope.map.clickedMarker.latitude = e.latLng.lat();
                            $scope.map.clickedMarker.longitude = e.latLng.lng();
                        }

                        $scope.$apply();
                    }
                }
            }
        });
    }]
    );
