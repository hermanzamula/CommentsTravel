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
        unique: true
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

var Blog = new Schema({
    "_id": {
        type: Number,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    comments: [Comment],
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
        type: [Number],
        required: true
    },
    tags: [String],
    places: [Number]
});

Blog.methods.increaseRating = function() {
    this.rating += 1;
    this.save();
};

Blog.methods.decreaseRating = function() {
    this.rating -= 1;
    this.save();
};

Blog.methods.addComment = function(comment) {
    this.comments.push(comment);
    this.save();
};

exports.Blog = mongoose.model('Blog', Blog);