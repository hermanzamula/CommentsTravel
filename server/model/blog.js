var mongoose = require(global.rootPath('lib/mongoose'));
Schema = mongoose.Schema;

var Comment = new Schema({
    username: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
        unique: false
    },
    date: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        unique: false
    },
    blog_id: {
        type: String,
        required: true,
        unique: false
    }
});

var Coordinate = new Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
});

var Blog = new Schema({
    username: {
        type: String,
        required: true
    },
    comments: {
        type: [Comment],
        required: false
    },
    body: {
        type: String
    },
    date: {
        type: Date
    },
    rating: {
        type: Number,
        required: true,
        unique: false
    },
    coords: {
        type: [Coordinate],
        required: true
    },
    tags: [String],
    places: [Number]
});

Blog.methods.increaseRating = function () {
    this.rating += 1;
    this.save();
};

Blog.methods.decreaseRating = function () {
    this.rating -= 1;
    this.save();
};

Blog.methods.addComment = function (comment) {
    this.comments.push(comment);
    this.save();
};

exports.Blog = mongoose.model('Blog', Blog);