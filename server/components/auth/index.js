
var Token = require('../token');
var User = require('../user');

module.exports = function ensureAuthorized(req, res, next) {
  var token = Token.get(req),
    user_id = token ? token.iss : null;

  if(!token) {
    res.sendStatus(401);
    return;
  }

  User.find(user_id).then(function (user) {
    req.user = user;
    global.user = user;

    if(!user.token || user.token.token_expires <= Date.now()) {
      res.sendStatus(401);
    }

    else {
      req.token = token;

      next();
    }

  });


};
