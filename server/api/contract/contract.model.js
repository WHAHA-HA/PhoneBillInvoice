var db = require('../../components/db')();
var User = require('../user/user.model');
var History = require('../history/history.model');
var ce = require('cloneextend');

var Contract = db.store.defineResource({
  name: 'contract',
  table: 'contracts_contract',
  afterUpdate: function (resource, data, cb) {
    History.add("contract", "update", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("contract", "create", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  relations: {
    belongsTo: {
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id'
      },
      document: {
        localField: 'document',
        localKey: 'document_id'
      }
    },
    hasMany: {
      documents: {
        localField: 'entity_document',
        foreignKey: 'entity_id'
      },
      contract: {
        localField: 'children',
        foreignKey: 'master_id'
      },
      inventory: {
        localField: 'inventories',
        foreignKey: 'contract_id'
      }
    }
  }
});

/* TODO: delete
Contract.createHistoryEntry = function (instance, actionKey, data) {

  var userId = User.currentId();

  var defaults = {
    entity_type: 'contract',
    entity_id: instance.id,
    created_at: new Date(),
    created_by: userId,
    action_key: actionKey
  };

  var entry = ce.cloneextend(defaults, data);

  return History.create(entry);

};*/

module.exports = Contract;
