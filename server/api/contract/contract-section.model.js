var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'contract_section',
  table: 'contracts_contract_section',
  afterUpdate: function (resource, data, cb) {
    History.add("contract_section", "update", data.id, JSON.stringify(data), data.contract_id, 'contract');
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("contract_section", "create", data.id, JSON.stringify(data), data.contract_id, 'contract');
    if (cb) {
      cb(null, data);
    }
  },
  afterDestroy: function (resource, data, cb) {

    History.add("contract_section", "destroy", data.id, JSON.stringify(resource.section), resource.contract_id, 'contract');
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    belongsTo: {
      contract: {
        localField: 'contract',
        localKey: 'contract_id'
      }
    }
  }
});
