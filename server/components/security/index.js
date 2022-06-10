var Permission = require('../permission');
var ContentFilterSecurity = require('./content-filter');
var User = require('../user');
var Token = require('../token');

// TODO: This is not optimized

var security = function (module, action) {

  return function (req, res, next) {

    var token = Token.get(req);
    User.find(token.iss, {with: ['user_in_role', 'user_in_role.role']})
      .then(function (user) {
        // Get all permissions for this user roles

        var unrestrictedRole =   req.app.get('unrestricted role');

        if(User.isInRole(user, unrestrictedRole)) {
          next();
          return;
        }

        return Permission.findAll({
          where: {
            role_id: {
              'in': user.roles.map(function (x) {
                return x.id;
              })
            },
            module_id: {'===': module}
          }
        }, {with: ['role', 'permission_action', 'permission_filter', 'permission_filter.filter']})
      })
      .then(function (permissions) {
        var actions = [];
        // Even there should not be duplicate permissions set for same role and module pair
        permissions.forEach(function (permission) {
          actions = actions.concat(permission.actions.map(function (x) {
            return x.name;
          }));
        });

        // If action is in the list than we are fine
        if (actions.indexOf(action) > -1) {
          // Apply content filter
          ContentFilterSecurity.apply(req, permissions);
          next();
        }
        else {
          res.status(403).send({status: 403, errors: ['You don\'t have permission to access this section']});
        }

      });


  }
};

module.exports = security;
