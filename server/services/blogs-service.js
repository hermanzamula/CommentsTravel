var Blog = require(global.rootPath("server/model/blog")).Blog;

var BlogService = {};

BlogService.saveBlog = function (blog) {
    var newBlog = new Blog(blog);
    newBlog.save(function (err) {
        if (err) console.log(err);

    });
};

BlogService.addComment = function (blog, comment) {
    Blog.findById(blog, function (err, doc) {
        doc.addComment(comment);
    });
};

BlogService.getBlogs = function (place, callback) {
    Blog.find({'coords.lat': place.lat, 'coords.lng': place.lng}, function (err, doc) {
        callback(doc);
    });
};

BlogService.getAllBlogs = function (callback) {
    Blog.find({}, function (err, doc) {
        callback(doc);
    });
};

BlogService.updateRating = function (id, rating, callback) {
    Blog.findByIdAndUpdate(id, {rating: rating}, null, function (err) {
        console.log(err);
        if (callback) {
            callback();
        }
    })
};

BlogService.getMappedBlogs = function (callback) {
    var mr = {};
    mr.map = function () {
        emit({lat: this.coords[0].lat, lng: this.coords[0].lng}, 1);
    };
    mr.reduce = function (key, value) {
        return value.length;
    };
    Blog.mapReduce(mr, function (err, results, stats) {
        if (err) console.log(err);
        callback(convertToBlogAreas(results));
    });

    function convertToBlogAreas(mrResult) {
        var i = mrResult.length - 1;
        var result = [];
        while (i >= 0) {
            var object = mrResult[i];
            result.push({coords: object._id, blogs: object.value});
            i--;
        }
        return result;
    }

};

exports.BlogService = BlogService;



