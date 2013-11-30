var Blog = require(global.rootPath("server/model/blog")).Blog;

var CommentsService = {};

CommentsService.getComments = function(blog, callback) {
    Blog.findOne(blog, function(err, data) {
         callback(data && data.comments || []);
    })
};

exports.CommentsService = CommentsService;