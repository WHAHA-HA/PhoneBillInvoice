var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'account',
  table: 'common_account',
  afterUpdate: function (resource, data, cb) {
    History.add("account", "update", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("account", "create", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("account", "destroy", data.id, JSON.stringify(resource.account));
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    hasOne: {
      dictionary: {
        localField: 'status',
        localKey: 'status_id'
      }
    },
    belongsTo :{
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id'
      }
    }
  }
});
