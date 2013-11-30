var mongoose = require(global.rootPath('lib/mongoose'));
Schema = mongoose.Schema;

var Place = new Schema({
    "_id":  {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    urlInfo: {
        type: String
    }
});

exports.Place = mongoose.model("Place", Place);