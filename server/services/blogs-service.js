var Blog = require(global.rootPath("server/model/blog")).Blog;

var BlogService = {};

BlogService.saveBlog = function(blog) {
    var newBlog = new Blog(blog);
    newBlog.save(function(err, dov){
        if(err) console.log(err);

    });
};

BlogService.addComment = function(blog, comment) {
    Blog.findById(blog, function(err, doc) {
        doc.addComment(comment);
    });
};

BlogService.getBlogs = function(place, callback) {
    Blog.find({coords: place}, function(err, doc) {
        callback(doc);
    });
};

BlogService.getAllBlogs = function(callback) {
    Blog.find({}, function(err, doc) {
        callback(doc);
    });
};

exports.BlogService = BlogService;



