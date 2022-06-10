/**
 * Created by bear on 2/23/16.
 */
var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'equipment_interface',
  table: 'appdata_equipment_interface',
  afterUpdate: function (resource, data, cb) {
    History.add("equipment_interface", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("equipment_interface", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("equipment_interface", "destroy", data.id, JSON.stringify(resource.equipment_interface));
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    belongsTo: {
      equipment: {
        localField: 'equipment',
        localKey: 'equip_id'
      }
    }
  }
});
