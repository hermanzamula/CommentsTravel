var mapService = require(global.rootPath('server/services/map-service')).MapService;

exports.savePlace = function(req, resp) {
    mapService.savePlace(req.body);
    resp.status(200).send();
};

exports.getAll = function(req, resp) {
    mapService.readAll(function(data){
        resp.json(data);
    })
};