var blogService = require(global.rootPath('server/services/blogs-service')).BlogService;

exports.save = function (req, res) {
    var blog = req.body;
    blogService.saveBlog(blog);
    res.status(200).send();
};

exports.addComment = function (req, res) {
    var comment = req.body.comment;
    var blogId = req.body.blog;
    blogService.addComment(blogId, comment);
    res.status(200).send();
};

exports.getByCoords = function (req, resp) {
    var params = req.params;
    blogService.getBlogs({lat: params.lat, lng: params.lng},  function (blogs) {
        resp.json(blogs);
    })
};

exports.getAll = function (req, resp) {
    blogService.getAllBlogs(function (blogs) {
        resp.json(blogs);
    })
};

exports.getAllMapped = function (req, resp) {
    blogService.getMappedBlogs(function (blogAreas) {
        resp.json(blogAreas);
    })
};

exports.getAllMappedByScale = function(req, resp) {
    var params = req.query;
    blogService.getScaledBlogs([params.lng, params.lat], params.radius, params.limit || 100000, function(blogs) {
        resp.json(blogs)
    })
};

exports.updateRating = function (req, resp) {
    blogService.updateRating(req.params.blog, req.params.rating);
    resp.status(200).send();
};