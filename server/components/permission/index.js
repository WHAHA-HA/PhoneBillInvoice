var db = require('../../components/db')();
var RoleModel  = require('../role');
var PermissionAction  = require('../permission-action');
var PermissionFilter  = require('../permission-filter');
var History = require('../../api/history/history.model');

var PermissionModel = db.store.defineResource({
  name: 'permission',
  table: 'security_permission',
  afterUpdate: function (resource, data, cb) {
    History.add("permission", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("permission", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("permission", "destroy", data.id, JSON.stringify(resource.permission));
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    hasOne: {
      role: {
        localField: 'role',
        localKey: 'role_id'
      }
    },
    hasMany: {
      permission_action: {
        localField: 'actions',
        foreignKey: 'permission_id'
      },
      permission_filter: {
        localField: 'permission_filters',
        foreignKey: 'permission_id'
      }
    }
  }
});

module.exports = PermissionModel;
