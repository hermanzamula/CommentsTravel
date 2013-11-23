/**
 * Created by elena.philipenko on 23.11.13.
 */
var nconf = require('nconf');
var path = require('path');
nconf.argv()
    .env()
    .file({file: path.join( __dirname, 'config.json')});

module.exports = nconf;