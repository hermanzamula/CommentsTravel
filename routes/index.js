
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.sendfile("./application/pages/index.html");
};