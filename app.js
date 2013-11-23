
var express = require('express');
var routes = require('routes');
var http = require('http');
var path = require('path');
var Comment = require('./model/comment');
var config = require('config');
var log = require('lib/logs');
var app = express();

// all environments
app.set('port', config.get('port'));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
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

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
