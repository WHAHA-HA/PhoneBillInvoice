/**
 * Created by bear on 2/20/16.
 */
var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'customers',
  table: 'appdata_customer',
  afterUpdate: function (resource, data, cb) {
    History.add("customer", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("customer", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("customer", "destroy", data.id, JSON.stringify(resource.customer));
    if (cb) {
      cb(null, data);
    }
  },
});
