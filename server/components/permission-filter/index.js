var db = require('../../components/db')();
var PermissionModel = require('../../components/permission');
var History = require('../../api/history/history.model');

var PermissionFilter = db.store.defineResource({
  name: 'permission_filter',
  table: 'security_permission_content_filter_map',
  afterUpdate: function (resource, data, cb) {
    History.add("permission_filter", "update", data.id, JSON.stringify(data), data.permission_id, 'permission');
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("permission_filter", "create", data.id, JSON.stringify(data), data.permission_id, 'permission');
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {
    History.add("permission_filter", "destroy", data.id, JSON.stringify(resource.permission_filter), resource.permission_id, 'permission');
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    belongsTo: {
      content_filter: {
        localField: 'filter',
        localKey: 'filter_id'
      },
      permission: {
        localField: 'permission',
        localKey: 'permission_id'
      }
    }
  }
});
module.exports = PermissionFilter;
