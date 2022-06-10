/**
 * Created by bear on 2/23/16.
 */
var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'equipment',
  table: 'appdata_equipment',
  afterUpdate: function (resource, data, cb) {
    History.add("equipment", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("equipment", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("equipment", "destroy", data.id, JSON.stringify(resource.equipment));
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    belongsTo: {
      site: {
        localField: 'site',
        localKey: 'site_id'
      },
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id'
      },
      contract: {
        localField: 'contract',
        localKey: 'contract_id'
      }
    },
    hasOne: {
      dictionary: {
        localField: 'siteType',
        localKey: 'site_type'
      }
    },
    hasMany: {
      equipment_interface: {
        localField: 'equipment_interfaces',
        foreignKey: 'equip_id'
      }
    }
  }
});
