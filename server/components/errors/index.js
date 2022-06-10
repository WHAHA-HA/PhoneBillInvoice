/**
 * Error responses
 */

'use strict';

module.exports[404] = function pageNotFound(req, res) {
  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };

  res.status(result.status);
  res.render(viewFilePath, function (err) {
    if (err) { return res.json(result, result.status); }

    res.render(viewFilePath);
  });
};

module.exports.api = function (err, req, res, next) {

  if(err.status === 400) {
    console.log('400: ', err);
    res.status(400).send(err);
  }
  else if(err) {
    res.status(500).send(err);
    console.log('500: ', err);
    next(err);
  }
};
