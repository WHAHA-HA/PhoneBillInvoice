var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'building',
  table: 'appdata_building',
  afterUpdate: function (resource, data, cb) {
    History.add("building", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("building", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("building", "destroy", data.id, JSON.stringify(resource.building));
    if (cb) {
      cb(null, data);
    }
  },
});
