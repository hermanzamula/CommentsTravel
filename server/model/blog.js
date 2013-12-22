var mongoose = require(global.rootPath('lib/mongoose'));
var Aggregate = require('mongoose/lib/aggregate');
var _ = require('lodash-node');
Schema = mongoose.Schema;

var EARTH_RADIUS = 6371;

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
 * @param center [longitude, latitude]: array
 * @param nearKm distance from center, in km
 * @param limit return items limit.
 * @param callback
 *
 * Items is ordered by comments size within.
 */
Blog.statics.findByPlace = function (center, nearKm, limit, callback) {

    var cords = _.transform(center, function(result, coord){
        result.push(parseFloat(coord));
    });

    var match = {
        near:  cords,
        maxDistance: parseFloat(parseFloat(nearKm) / parseFloat(EARTH_RADIUS)),
        num: 100000,
        distanceField: "dist",
        spherical: true
    };

    this.aggregate()
        .near(match)
        .group({
            _id: "$coords",
            blogs: {$sum: 1}
        })
        .project({coords: "$_id", blogs: 1, commentsLength: 1})
        .limit(limit)
        .exec(function (err, docs) {
            err && console.log(err);
            callback(docs || []);
        });
};

exports.Blog = mongoose.model('Blog', Blog);