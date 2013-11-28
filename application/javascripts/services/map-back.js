angular.module("map-back", ['ngResource'])
    .factory('Location',['$resource', function($resource) {
        return $resource('http://maps.googleapis.com/maps/api/geocode/json', {}, {
            getLocation: {method: 'GET', isArray: false, params: {
                sensor: false
            }}
        });
    }]);