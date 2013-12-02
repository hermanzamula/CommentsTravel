angular.module('coordsForNewComment', [])
    .service('Coordinates', function () {
        var coordinate = {};
        return {
            getCoords: function () {
                return coordinate;
            },
            setCoords: function(lt, lng) {
                coordinate.lat = lt;
                coordinate.lng = lng;
            }
        };
    });