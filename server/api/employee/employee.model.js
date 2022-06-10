/**
 * Created by bear on 2/29/16.
 */
var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'employee',
  table: 'appdata_employee',
  afterUpdate: function (resource, data, cb) {
    History.add("employee", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("employee", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("employee", "destroy", data.id, JSON.stringify(resource.employee));
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
    hasOne: {
      dictionary: {
        localField: 'status',
        localKey: 'status_id'
      }
    }
  }
});
