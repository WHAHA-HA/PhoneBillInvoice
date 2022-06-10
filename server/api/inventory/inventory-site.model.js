var db = require('../../components/db')();
var History = require('../history/history.model');

var InventorySite = db.store.defineResource({
  name: 'inventory_site',
  table: 'inventory_site_map',
  afterUpdate: function (resource, data, cb) {
    History.add("inventory_site", "update", data.id, JSON.stringify(data), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {

    History.add("inventory_site", "create", data.id, JSON.stringify(resource.site), data.inventory_id, 'inventory');
    if (cb) {
        cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {
    History.add("inventory_site", "destroy", data.id, JSON.stringify(resource.site), resource.inventory_id, 'inventory');
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    belongsTo: {
      inventory: {
        localField: 'inventory',
        localKey: 'inventory_id'
      },
      site: {
        localField: 'site',
        localKey: 'site_id'
      }
    }
  }
});



module.exports = InventorySite;
