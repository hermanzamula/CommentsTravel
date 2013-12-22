angular.module('coordsForNewComment', [])
    .service('Coordinates', function () {

        //Inspired by http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
        function distHaversine(p1, p2) {

            function rad(x) {
                return x * Math.PI / 180;
            }

            var R = 6371; // earth's mean radius in km
            var dLat = rad(p2.lat - p1.lat);
            var dLong = rad(p2.lng - p1.lng);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;

            return d.toFixed(3);
        }

        var coordinate = {};

        return {
            getCoords: function () {
                return coordinate;
            },
            setCoords: function(lt, lng) {
                coordinate.lat = lt;
                coordinate.lng = lng;
            },
            setCenter: function(lt, lng) {
                coordinate.center = {
                    lat: lt,
                    lng: lng
                }
            },
            setLeftCorner: function(lt, lng) {
                coordinate.corner = {
                    lat: lt,
                    lng: lng
                }
            },
            setRightCorner: function(lt, lng) {
                coordinate.cornerRight = {
                    lat: lt,
                    lng: lng
                }
            },
            getRadius: function() {
                if(coordinate.cornerRight) {
                    return (distHaversine(coordinate.cornerRight, coordinate.corner) / 2);
                }
                return distHaversine(coordinate.center, coordinate.corner)
            }
        };
    });