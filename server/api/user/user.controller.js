'use strict';

var User = require('./user.model'),
  Role = require('../../components/role'),
  UserInRoleModel = require('../../components/user-in-role'),
  UserValidation = require('./user.validation'),
  Token = require('../../components/token'),
  extend = require('cloneextend').cloneextend;
var Promise = require('es6-promise').Promise;
var db = require('../../components/db')();

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  if (query.where && query.where.roles && query.where.roles.in) {
    //select distinct("user".*) from "user"  join user_in_role on "user".id = user_in_role.user_id
    //where user_in_role.role_id in (1,2) and "user".first_name like 'And%'

    var knex = db.adapter.query;
    var roles = query.where.roles;

    var promise =  knex('user')
      .join('user_in_role', 'user.id', '=', 'user_in_role.user_id');

    if (roles.in) {
      promise.whereIn('user_in_role.role_id', roles.in );
    }

    promise.distinct("user.*")
      .select();


    promise.then(function (result) {
        res.send(result);
      })
      .catch(next);
  }
  else {

    User.findAllWithPaging(query, {with: ['user_in_role', 'user_in_role.role']})
      .then(function (result) {
        /*      result.forEach(function (user) {
         delete user.avatar;
         });*/

        res.send(result);
      })
      .catch(next);
  }

};


exports.me = function (req, res, next) {
  var token = Token.get(req);
  User.find(token.iss, {with: ['user_in_role', 'user_in_role.role', 'theme']}).then(function (user) {
      res.send(createUser(user));
    })
    .catch(next);
};

exports.show = function (req, res, next) {
  User.find(req.params.id).then(function (user) {
      res.send(createUser(user));
    })
    .catch(next);
};

exports.applyTheme = function (req, res, next) {
    User.find(req.params.id).then(function (user) {
        user.theme_id = req.body.id;
        User.update(user.id, user).then(function(user){
            res.end();
        });
    }) .catch(next);
};

exports.updateProfile = function (req, res, next) {
  User.find(req.params.id).then(function (user) {

    user.avatar = req.body.avatar;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.mobile_number = req.body.mobile_number;

    User.update(user.id, user).then(function(user){
      res.end();
    }, function(err) {
      res.status(400).send(err.errors);
    })
      .catch(next);

  }) .catch(next);
};

exports.update = function (req, res, next) {

  var input = req.body;
  UserValidation.validateUpdateInput(input)
    .then(function () {

      return User.find(input.id).then(function (user) {
          return extend(user, input);
        })
        .then(function (user) {

          // If we are deactivating user than just remove his token so next time user cannot login
          if (!user.is_active) {
            user.token = '';
          }

          return User.update(user.id, user, {with: ['user_in_role', 'user_in_role.role']})
            .then(function (user) {
              // set roles
              return UserInRoleModel.destroyAll({
                where: {user_id: {'===' : user.id}}
              })
                .then(function () {
                  return user;
                });

            })
            .then(function (user) {
              if(input.roles && input.roles.length) {
                var promises = [];

                input.roles.forEach(function (role) {

                  // set roles
                  promises.push(UserInRoleModel.create({
                    user_id: user.id,
                    role_id: role
                  }));
                });

                return Promise.all(promises).then(function () {
                  return user;
                });

              }
              else {
                return user;
              }
            })
            .then(function () {
              return User.find(input.id, {with: ['user_in_role', 'user_in_role.role']});
            })
            .then(function (user) {
              res.send(createUser(user));
            });
        });
    })
    .catch(next);

};

exports.create = function (req, res, next) {

  var input = req.body;

  var user = {
    email: input.email,
    mobile_number: input.mobile_number,
    first_name: input.first_name,
    last_name: input.last_name,
    password: input.password,
    username: input.username,
    avatar: input.avatar
  };


  UserValidation.validateCreateInput(input)
    .then(function () {

      return User.create(user, {with: ['user_in_role', 'user_in_role.role']})
        .then(function (user) {


          if(input.roles && input.roles.length) {
            var promises = [];

            input.roles.forEach(function (role) {

              // set roles
              promises.push(UserInRoleModel.create({
                user_id: user.id,
                role_id: role
              }));
            });

            Promise.all(promises).then(function () {
              return user;
            })
              .then(function() {
                return User.find(user.id, {with: ['user_in_role', 'user_in_role.role']});
              })
              .then(function(user) {
                res.send(createUser(user));
              });

          }
          else {
            res.send(createUser(user));
          }

        });

    })
    .catch(next);
};

exports.updatePassword = function (req, res, next) {

  User.find(req.params.id).then(function (user) {

    var o_pwd = req.body.o_pwd;
    var n_pwd = req.body.n_pwd;

    if (user.password !== o_pwd ) {

      res.status(400).send({
        msg: 'Old password is not correct.'
      });
    }
    else {
      user.password = n_pwd;

      User.update(user.id, user).then(function(user){
        res.end();
      }, function(err) {
        res.status(400).send(err.errors);
      })
      .catch(next);
    }

  }) .catch(next);
};


function createUser(user) {
  return {
    id: user.id,
    email: user.email,
    roles: user.roles,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
    theme: user.theme,
    is_active: user.is_active,
    mobile_number: user.mobile_number
  };
}


