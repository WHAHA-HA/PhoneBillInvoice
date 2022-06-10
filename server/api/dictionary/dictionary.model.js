var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
    name: 'dictionary',
    table: 'common_dictionary',
    afterUpdate: function (resource, data, cb) {
        History.add("dictionary", "update", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterCreate: function (resource, data, cb) {
        History.add("dictionary", "create", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterDestroy: function (resource, data, cb) {

        History.add("dictionary", "destroy", data.id, JSON.stringify(resource.dictionary));
        if (cb) {
            cb(null, data);
        }
    },
    computed: {
        // TODO: OBSOLETE
        key: ['id', function (id) {
            return id;
        }]
    }
});
