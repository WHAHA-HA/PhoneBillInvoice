var db = require('../../components/db')();
var validator = require('../../components/validator');
var History = require('../../api/history/history.model');


var RoleModel = db.store.defineResource({
  name: 'role',
  table: 'security_role',
  afterUpdate: function (resource, data, cb) {
    History.add("role", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("role", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("role", "destroy", data.id, JSON.stringify(resource.role));
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    hasMany: {
      user_in_role: {
        localField: 'user_in_roles',
        foreignKey: 'role_id'
      },
      permission: {
        localField: 'permissions',
        foreignKey: 'role_id'
      }
    }
  }
});

module.exports = RoleModel;
