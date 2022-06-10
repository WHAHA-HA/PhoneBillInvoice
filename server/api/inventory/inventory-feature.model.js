var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'inventory_feature',
  table: 'inventory_wireline_voice_feature',
  afterUpdate: function (resource, data, cb) {
    History.add("inventory_feature", "update", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("inventory_feature", "create", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {
    History.add("inventory_feature", "destroy", data.id, JSON.stringify(resource.feature), resource.inventory_id, 'inventory');
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
