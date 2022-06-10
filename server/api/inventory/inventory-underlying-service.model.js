var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'underlying_service',
  table: 'inventory_trunk_underlying_service',
  afterUpdate: function (resource, data, cb) {
    History.add("inventory_underlying_service", "update", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("inventory_underlying_service", "create", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {
    History.add("inventory_underlying_service", "destroy", data.id, JSON.stringify(resource.service), resource.inventory_id, 'inventory');
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    belongsTo: {
      inventory: {
        localField: 'inventory',
        localKey: 'inventory_id'
      }
    }
  }
});
