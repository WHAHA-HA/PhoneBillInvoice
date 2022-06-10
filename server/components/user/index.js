var db = require('../../components/db')();
var validator = require('../../components/validator');
var RoleModel = require('../role');
var UserInRoleModel = require('../user-in-role');
var History = require('../../api/history/history.model');




var userScheme = {
    id: {
        numericality: true
    },
    username: {
        presence: true,
        length: {
            minimum: 3,
            maximum: 50
        }
    },
    first_name: {
        presence: true,
        length: {
            minimum: 2,
            maximum: 50
        }
    },
    last_name: {
        presence: true,
        length: {
            minimum: 2,
            maximum: 50
        }
    },
    email: {
        presence: true,
        email: true
    },
    password: {
        presence: true,
        length: {
            minimum: 3,
            maximum: 100
        }
    },
    theme_id: {
        presence: false
    }
};


var UserModel = db.store.defineResource({
    name: 'user',
    table: 'security_user',
    afterUpdate: function (resource, data, cb) {
      var History = require('../../api/history/history.model');
      console.log('User Update');
      History.add("user", "update", data.id, JSON.stringify(data));
      if (cb) {
        cb(null, data);
      }
    },
    afterCreate: function (resource, data, cb) {
      var History = require('../../api/history/history.model');
      console.log('User Create');
      History.add("user", "create", data.id, JSON.stringify(data));
      if (cb) {
        cb(null, data);
      }
    },
    afterDestroy: function (resource, data, cb) {
      var History = require('../../api/history/history.model');
      History.add("user", "destroy", data.id, JSON.stringify(resource.user));
      if (cb) {
        cb(null, data);
      }
    },
    validate: function (User, user, cb) {
        validator.validateWithCallback(user, userScheme, cb);
    },
    relations: {
        hasMany: {
            user_in_role: {
                localField: 'user_in_role',
                foreignKey: 'user_id'
            }
        },
        belongsTo: {
            theme: {
                localField: 'theme',
                localKey: 'theme_id'
            }
        }
    },
    computed: {
        roles: ['user_in_role', function (items) {
                var roles = [];

                if (items) {
                    items.forEach(function (uir) {
                        roles.push(uir.role);
                    });
                }
                return roles;
            }]
    }
});

UserModel.isInRole = function (user, name) {
    var roleNames = user.roles.map(function (x) {
        return x.name;
    });

    return roleNames.indexOf(name) > -1;
};

UserModel.currentId = function () {
    var user = global.user;
    return user ? user.id : null;
};

module.exports = UserModel;
