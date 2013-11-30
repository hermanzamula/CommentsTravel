function root(path) {
    return __dirname + "/" + path;
}
global.rootPath = root;


var express = require('express');
var http = require('http');
var path = require('path');
//var Comment = require('./model/comment');
var config = require(root('config'));
var log = require(root('lib/logs'));
var index = require(root('server/routes/index'));

//------------------------------------ Rest routes ---------------------------------------------------------------------
var comments = require(root('server/routes/api/comments')),
    maps = require(root('server/routes/api/maps')),
    blogs = require(root('server/routes/api/blogs'));
//------------------------------------ End of rest routes --------------------------------------------------------------

var app = express();

// all environments
app.set('port', config.get('port'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'application')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', index.index);
app.get('/testData.json', index.testData);

var apiPath = "/api";

//--------------------------------- Blog routes -----------------------------------------------------------------------
app.get(apiPath + "/blogs/:place", blogs.getByPlace);
app.get(apiPath + "/blogs", blogs.getAll);
app.post(apiPath + "/blogs", blogs.save);

//--------------------------------- Comments routes -------------------------------------------------------------------
app.get(apiPath + "/comments/:blog", comments.getComments);
app.post(apiPath + "/comments/:blog", comments.save);

//--------------------------------- Maps routes -----------------------------------------------------------------------
app.post(apiPath + "/maps", maps.savePlace);
app.get(apiPath + "/maps", maps.getAll);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
