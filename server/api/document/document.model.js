var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'document',
  table: 'common_document',
  afterUpdate: function (resource, data, cb) {
    History.add("document", "update", data.id, JSON.stringify(data), resource.entity_id, resource.parent_type);
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("document", "create", data.id, JSON.stringify(data), resource.entity_id, resource.parent_type);
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("document", "destroy", data.id, JSON.stringify(resource.document), resource.entity_id, resource.parent_type);
    if (cb) {
      cb(null, data);
    }
  },
  relations: {

  }
});
