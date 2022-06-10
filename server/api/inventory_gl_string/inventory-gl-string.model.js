var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'inventoryGlStrings',
  table: 'gl_inventory_codes',
  afterUpdate: function (resource, data, cb) {
    History.add("inventoryGlStrings", "update", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("inventoryGlStrings", "create", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  }, 
  relations: {
    belongsTo: {   
      inventory: {
        localField: 'inventory',
        localKey: 'inv_id'
      },
      glString: {
        localField: 'gl_string',
        localKey: 'gl_string_id'
      }    
    }
  }
});
