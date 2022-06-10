var db = require('../../components/db')();
var History = require('../../api/history/history.model');

var ContentFilterModel = db.store.defineResource({
  name: 'content_filter',
  table: 'security_content_filter',
  afterUpdate: function (resource, data, cb) {
    History.add("content_filter", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("content_filter", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {
    History.add("content_filter", "destroy", data.id, JSON.stringify(resource.content_filter));
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    hasMany: {
      permission_filter: {
        localField: 'permission_filters',
        foreignKey: 'filter_id'
      }
    }
  }
});

module.exports = ContentFilterModel;
