
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.sendfile("./application/pages/index.html");
};

exports.testData = function(req, res){
    res.sendfile("./testData.json");
};

