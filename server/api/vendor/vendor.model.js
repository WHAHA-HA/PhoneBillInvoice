var db = require('../../components/db')();
var validator = require('../../components/validator');
var History = require('../history/history.model');
var VendorAlias = require('./vendor-alias.model');

var vendorScheme = {
  id: {
    numericality: true
  },
  name: {
    presence: true
  },
  code: {
    presence: true
  }
};

module.exports = db.store.defineResource({
  name: 'vendor',
  table: 'appdata_vendor',
  relations: {
    hasMany: {
      vendor_alias : {
        localField: 'aliases',
        foreignKey: 'vendor_id'
      }
    }
  },
  afterUpdate: function (resource, data, cb) {
    History.add("vendor", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("vendor", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("vendor", "destroy", data.id, JSON.stringify(resource.vendor));
    if (cb) {
      cb(null, data);
    }
  },
});
