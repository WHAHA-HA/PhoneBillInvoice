/**
 */

'use strict';

var User = require('../user/user.model');
var db = require('../../components/db')();
var jwt = require('jwt-simple');
var moment = require('moment');
var Token = require('../../components/token');

/**
 * auth/resetPassword
 */
exports.resetPassword = function (req, res) {

  if (!req.body.token) {
    res.status(400).send({
      error: {msg: 'You did not provide  password token.'}
    });
  }

  try {
    var token = jwt.decode(req.body.token, '1234567890'),
      pwd = req.body.password,
      user_id = token.iss;

    User.find(user_id).then(function (user) {
      if (user && token.exp > Date.now()) {


        user.password = pwd;
        user.reset_pwd_token = null;

        User.update(user.id, user);

        res.end();

      }
      else {
        res.status(400).send({
          error: {msg: 'Your token for password reset has been invalid or expired.'}
        });
      }
    }, function (err) {
      res.status(400).send([{error: "You have provided and invalid token"}]);
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send({
      error: {msg: 'You did not provide valid reset password token.'}
    });
  }

};

/**
 * auth/sendResetInstructions
 */
exports.sendResetInstructions = function (req, res) {
  User.findAll({email: req.body.email}).then(function (users) {
    if (users.length === 1) {

      var user = users[0];
      var expires = moment().add('hours', 1).valueOf();

      user.reset_pwd_token = jwt.encode({
        iss: user.id,
        exp: expires
      }, '1234567890');

      User.update(user.id, user);

      // TODO: Send email

      res.end();
    }
    else {
      res.status(400).send({
        error: {msg: 'We cannot find user with email provided.'}
      });
    }
  }, function (err) {
    res.status(400).send([{error: err}]);
  });

};


exports.login = function (req, res, next) {

  User.findAll({username: req.body.username, password: req.body.password})
    .then(function (users) {

      if (users.length < 1) {
        res.status(301).send({error: 'Invalid user credentials.'});
        return;
      }

      var user = users[0];

      if (!user.is_active) {
        res.status(301).send({error: 'User is not active.'});
        return;
      }

      var expires = moment().add('days', 7).valueOf();

      user.token = Token.set(user.id, expires);
      User.update(user.id, user);

      res.send({
        token: user.token
      });


    })
    .catch(next);
};
