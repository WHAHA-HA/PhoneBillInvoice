var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'site',
  table: 'appdata_site',
  afterUpdate: function (resource, data, cb) {
    History.add("site", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("site", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("site", "destroy", data.id, JSON.stringify(resource.site));
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    belongsTo: {
      site: {
        localField: 'parent',
        localKey: 'parent_id',
        parent: true
      },
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id'
      },
      building: {
        localField: 'building',
        localKey: 'building_id'
      }
    },
    hasMany: {
      site: {
        localField: 'sites',
        foreignKey: 'parent_id'
      },
      equipment: {
        localField: 'equipments',
        foreignKey: 'site_id'
      }
    },
    hasOne: {
      dictionary: {
        localField: 'type',
        localKey: 'site_type'
      }
    }
  }
});
