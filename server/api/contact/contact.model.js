/**
 * Created by bear on 2/20/16.
 */
var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'contacts',
  table: 'appdata_contact',
  afterUpdate: function (resource, data, cb) {
    History.add("contact", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("contact", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("contact", "destroy", data.id, JSON.stringify(resource.contact));
    if (cb) {
      cb(null, data);
    }
  },
  computed: {
    full_name: ['first_name', 'last_name', function (fname, lname) {
      return fname +  ' ' + lname;
    }]
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
      }
    }
  }
});
