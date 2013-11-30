var map = require(global.rootPath("server/model/map"));
var Place = map.Place;

var MapService = {};

MapService.savePlace = function(place) {
    Place.create(place);
};

MapService.readAll = function(callback) {
    Place.find({}, function(err, docs) {
        if(err) {
            console.error(err);
        }
        callback(docs);
    })
};

exports.MapService = MapService;
