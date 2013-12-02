var blogService = require(global.rootPath('server/services/blogs-service')).BlogService;

exports.save = function(req, res) {
    var blog = req.body;
    blogService.saveBlog(blog);
    res.status(200).send();
};

exports.addComment = function(req, res) {
    var comment = req.body.comment;
    var blogId = req.body.blog;
    blogService.addComment(blogId, comment);
    res.status(200).send();
};

exports.getByPlace = function(req, resp) {
    blogService.getBlogs(req.place, function(blogs) {
        resp.json(blogs);
    })
};

exports.getAll = function(req, resp) {
    blogService.getAllBlogs(function(blogs) {
        resp.json(blogs);
    })
};