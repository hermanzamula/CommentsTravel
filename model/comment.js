var mongoose = require('lib/mongoose');
Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    place: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        unique: false
    },
    _id:{
        type:String,
        required:true,
        unique:true
    }
});

schema.methods.increaseRating = function (){
//    this.rating = comment.rating + 1;
//    Comment.find
//    this.save();
};


exports.Comment = mongoose.model('Comment', schema);