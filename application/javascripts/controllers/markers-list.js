angular.module('markers-list', [])
    .factory('Markers', ['$location', function ($location) {
        var markers = [];
        var newMarker;
        var iconPath = "../img/marker-blue.png";
        var iconSizes = [
            {
                border: 2,
                size: {
                    w: 12,
                    h: 12
                }
            },
            {
                border: 5,
                size: {
                    w: 16,
                    h: 16
                }
            },
            {
                border: 8,
                size: {
                    w: 20,
                    h: 20
                }
            },
            {
                border: 10,
                size: {
                    w: 24,
                    h: 24
                }
            },
            {
                border: 'max',
                size: {
                    w: 30,
                    h: 30
                }
            }
        ];

        function addMarkerToMarkers(marker) {
            markers.push(marker);
        }

        function addMarker(markerData, onClick) {
            markerData.onClick = onClick;
            newMarker = createMarker(markerData);
            if (newMarker) {
                addMarkerToMarkers(newMarker);
            } else {
                console.error("Cannot add new marker with params: latitude = " + markerData.latitude +
                    ", longitude = " + markerData.longitude + ", title = " + markerData.title + "  ||  " + newMarker);
            }
        }

        function createMarker(markerData) {
            if ("latitude" in markerData && "longitude" in markerData && "title" in markerData) {
                var commentsCount = markerData.commentsCount || 0;
                var iconSettings = createIconSettings(commentsCount);
                return angular.extend({
                    showWindow: false,
                    icon: iconSettings
                }, markerData);
            }
            return false;
        }

        function createIconSettings(count) {
            var size, stopped = false, iconSettings = {};
            iconSizes.forEach(function (element) {
                if (!stopped) {
                    var border = element.border;
                    if (count <= border || border == 'max') {
                        size = element.size;
                        stopped = true;
                    }
                }
            });
            iconSettings.url = iconPath;
            iconSettings.size = new google.maps.Size(size.w, size.h);
            iconSettings.origin = new google.maps.Point(0, 0);
            iconSettings.anchor = new google.maps.Point(size.w / 2, size.h / 2);
            iconSettings.scaledSize = new google.maps.Size(size.w, size.h);
            return iconSettings;
        }

        return {
            addMarkers: function (markersData, onClick) {
                // if markersData is Array
                if (Object.prototype.toString.call(markersData) === '[object Array]') {
                    markersData.forEach(function (data) {
                        addMarker(data, onClick);
                    });
                } else {
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
                markers.forEach(function (element) {
                    element[key] = value;
                })
            },
            getMarkers: function () {
                return markers;
            },
            deleteMarkerByNumber: function (number) {
                markers.splice(number, 1);
            },
            deleteLastMarkers: function (number) {
                markers.splice(-1, number);
            }

        };
    }]);
