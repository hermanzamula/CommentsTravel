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
    location: {
        type: [Number],
        index: "2d"
    },
    infoUrl: {
        type: String
    }
});

exports.Place = mongoose.model("Place", Place);