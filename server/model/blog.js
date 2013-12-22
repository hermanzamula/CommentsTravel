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
        type: [Number],
        index: "2d",
        required: true
    },
    commentsLength: {
        type: Number
    },
    tags: [String],
    places: [Number]
});

Blog.index({ coords: true });

Blog.methods.increaseRating = function () {
    this.update({
        $inc: {rating: 1}
    });
};

Blog.methods.decreaseRating = function () {
    this.update({
        $inc: {rating: -1}
    });
};

Blog.methods.addComment = function (comment) {
    this.comments.push(comment);
    this.commentsLength = this.commentsLength + 1 || 1;
    this.save();
};

/**
 *
 * @param center type: Coordinate
 * @param nearM distance from center, in meters
 * @param limit return items limit.
 * @param callback
 *
 * Items is ordered by comments size within.
 */
Blog.statics.findByPlace = function (center, nearM, limit, callback) {

    console.log();

    var match = {
        near: [parseFloat(center.lng), parseFloat(center.lat)],
        maxDistance: nearM,
        distanceField: 'coordsDist'
    };
    this
        .aggregate([
            {$geoNear: match},
            {$group: {
                    _id: "$coords",
                    blogs: {$sum: 1}
                }
            },
            {$project: {coords: "$_id", blogs: 1, commentsLength: 1}},
            { $sort: {blogs: -1}}, //TODO: Replace blogs by comments. Sort by comments
            {$limit: limit}
        ])
        .exec(function (err, docs) {
            err && console.log(err);
            callback(err, docs)
        })
};

exports.Blog = mongoose.model('Blog', Blog);