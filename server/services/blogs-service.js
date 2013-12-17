var Blog = require(global.rootPath("server/model/blog")).Blog;

var BlogService = {};

BlogService.saveBlog = function (blog) {
    var newBlog = new Blog(blog);
    newBlog.save(function (err, dov) {
        if (err) console.log(err);

    });
};

BlogService.addComment = function (blog, comment) {
    Blog.findById(blog, function (err, doc) {
        doc.addComment(comment);
    });
};

BlogService.getBlogs = function (place, callback) {
    Blog.find({'coords.lat': place.lat, 'coords.lng':place.lng}, function (err, doc) {
        callback(doc);
    });
};

BlogService.getAllBlogs = function (callback) {
    Blog.find({}, function (err, doc) {
        callback(doc);
    });
};

BlogService.getMapedBlogs = function (callback) {
    var blogAreas = [];
    Blog.find({}, function (err, doc) {
        var i = doc.length - 1;
        while (i >= 0) {
            var blog = doc[i];
            var j = blogAreas.length - 1;
            if (blogAreas.length == 0) {
                blogAreas.push({coords: blog.coords[0], blogs: 1});
            } else {
                var added = false;
                while (j >= 0) {
                    var area = blogAreas[j];
                    if (blog.coords[0].lat == area.coords.lat
                        && blog.coords[0].lng == area.coords.lng) {
                        area.blogs = area.blogs + 1;
                        added = true;
                    }
                    j--;
                }
                if(!added){
                    blogAreas.push({coords: blog.coords[0], blogs: 1});
                }
            }
            i--;
        }
        callback(blogAreas);
    });
};

exports.BlogService = BlogService;



