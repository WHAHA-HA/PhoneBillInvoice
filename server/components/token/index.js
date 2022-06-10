var jwt = require('jwt-simple');
var JWT_SECRET_STRING = "FHDJSKLAHFD7FH00H374JE033JF03MFNVWHE00444NNJSS";

module.exports.get = function (req) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  var bearerQuery = req.query["authorization"];

  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];

    return jwt.decode(bearerToken, JWT_SECRET_STRING);
  }
  else if (typeof bearerQuery !== 'undefined') {
    bearerToken = bearerQuery;
    return jwt.decode(bearerToken, JWT_SECRET_STRING);
  }

};

module.exports.set = function (id, expires) {
  return jwt.encode({
    iss: id,
    exp: expires
  }, JWT_SECRET_STRING);
};
