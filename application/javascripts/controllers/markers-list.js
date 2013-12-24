angular.module('markers-list', [])
    .factory('Markers', function () {
        var markers = [];
        var newMarker;
        function addMarkerToMarkers (marker) {
            markers.push(marker);
        }

        function createMarker (markerData, onClick) {
            if(markerData.latitude && markerData.longitude && markerData.title) {
                var marker = {};
                marker.latitude = markerData.latitude;
                marker.longitude = markerData.longitude;
                marker.title = markerData.title;
                marker.showWindow = markerData.showWindow ? markerData.showWindow : false;
                if(markerData.icon){
                    marker.icon = markerData.icon
                }

                marker.onClick = onClick;

                return marker;
            }
            return false;
        }

        function addMarker (markerData, onClick) {
            newMarker = createMarker(markerData, onClick);
            if(newMarker){
                addMarkerToMarkers(newMarker);
            }else{
                console.error("Cannot add new marker with params: latitude = " + markerData.latitude +
                    ", longitude = " + markerData.longitude + ", title = " + markerData.title + "  ||  " + newMarker);
            }
        }

        return {
            addMarkers: function (markersData, onClick) {
                // if markersData is Array
                if( Object.prototype.toString.call( markersData ) === '[object Array]' ) {
                    markersData.forEach(function(data){
                       addMarker(data, onClick);
                    });
                }else{
                   addMarker(markersData, onClick);
                }
            },
            setMarkers: function (markersData, onClick) {
                this.deleteAllMarkers();
                this.addMarkers(markersData, onClick);
            },
            deleteAllMarkers: function () {
                markers = [];
            },
            addProps: function (key, value) {
                markers.forEach(function(element){
                   element[key] = value;
                })
            },
            getMarkers: function () {
                return markers;
            }
        };
    });
