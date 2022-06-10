var db = require('../../components/db')();
var PermissionModel = require('../../components/permission');
var History = require('../../api/history/history.model');

var PermissionAction = db.store.defineResource({
  name: 'permission_action',
  table: 'security_permission_action',
  afterUpdate: function (resource, data, cb) {
    History.add("permission_action", "update", data.id, JSON.stringify(data), data.permission_id, 'permission');
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("permission_action", "create", data.id, JSON.stringify(data), data.permission_id, 'permission');
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {
    History.add("permission_action", "destroy", data.id, JSON.stringify(resource.permission_action), resource.permission_id, 'permission');
    if (cb) {
      cb(null, data);
    }
  }
});
module.exports = PermissionAction;
