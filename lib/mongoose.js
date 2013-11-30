/**
 * Created by elena.philipenko on 22.11.13.
 */

var mongoose = require('mongoose');
var config = require(global.rootPath("config"));

mongoose.connect(config.get('mongoose:uri'));

module.exports = mongoose;
