var commentsService = require(global.rootPath('server/services/comments-service')).CommentsService;


exports.getComments = function (req, res) {
    commentsService.getComments(req.params.blog, function(data) {
        res.json(data);
    });
};

exports.save = function (req, res) {
    commentsService.getComments(req.params.blog, req.body);
    res.status(200).send();
};
