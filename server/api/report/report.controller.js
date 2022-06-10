'use strict';

var Report = require('../../components/report');


exports.show = function (req, res, next) {

  var reportId = req.params.id;
  
  Report.load(reportId, req.ip, function (err, result) {   

    if (err) {
      res.status(400).send(err);
    }
    else {
      res.send(Report.getEmbedCode(result, reportId));
    }
  });


};

