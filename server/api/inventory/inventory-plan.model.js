var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'inventory_plan',
  table: 'inventory_wireless_plan',
  afterUpdate: function (resource, data, cb) {
    History.add("inventory_plan", "update", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("inventory_plan", "create", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {
    History.add("inventory_plan", "destroy", data.id, JSON.stringify(resource.plan), resource.inventory_id, 'inventory');
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
