angular.module("map-front", [])
    .controller("map-controller", function ($scope, $timeout, $log){


        // Enable the new Google Maps visuals until it gets enabled by default.
        // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
        google.maps.visualRefresh = true;

        angular.extend($scope, {

            position: {
                coords: {
                    latitude: 50.45,
                    longitude: 30.52
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
            markersProperty: [ {
                latitude: 50.45,
                longitude: 30.52
            }],

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
    }
);
