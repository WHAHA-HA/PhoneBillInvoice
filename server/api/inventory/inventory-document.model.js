var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
    name: 'inventory_document',
    table: 'inventory_document',
    afterUpdate: function (resource, data, cb) {
    History.add("inventory_document", "update", data.id, JSON.stringify(data), resource.entity_id, resource.parent_type);
        if (cb) {
            cb(null, data);
        }
    },
    afterCreate: function (resource, data, cb) {
        History.add("inventory_document", "create", data.id, JSON.stringify(data), resource.entity_id, resource.parent_type);
        if (cb) {
            cb(null, data);
        }
    },
    afterDestroy: function (resource, data, cb) {

        History.add("inventory_document", "destroy", data.id, JSON.stringify(resource.document), resource.entity_id, resource.parent_type);
        if (cb) {
            cb(null, data);
        }
    },
    relations: {
        belongsTo: {
            dictionary: {
                localField: 'contract_type',
                localKey: 'contract_type_id'
            }
        }
    }
});
