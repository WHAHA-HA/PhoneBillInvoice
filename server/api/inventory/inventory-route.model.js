var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'route',
  table: 'inventory_toll_free_number_route',
  afterUpdate: function (resource, data, cb) {
    History.add("inventory_route", "update", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("inventory_route", "create", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {
    History.add("inventory_route", "destroy", data.id, JSON.stringify(resource.route), resource.inventory_id, 'inventory');
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
