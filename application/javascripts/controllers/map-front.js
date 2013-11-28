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

            position: {
                coords: {
                    latitude: $scope.location.lat,
                    longitude: $scope.location.lng
                }
            },

            /** the initial center of the map */
            centerProperty: {
                latitude: 50.45,
                longitude: 30.52
            },

            /** the initial zoom level of the map */
            zoomProperty: 5,

            /** list of markers to put in the map */
            markersProperty: [
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

            // These 2 properties will be set when clicking on the map
            clickedLatitudeProperty: null,
            clickedLongitudeProperty: null,

            eventsProperty: {
                click: function (mapModel, eventName, originalEventArgs) {
                    // 'this' is the directive's scope
                    $log.log("user defined event on map directive with scope", this);
                    $log.log("user defined event: " + eventName, mapModel, originalEventArgs);
                }
            }
        });
    }]
    );
