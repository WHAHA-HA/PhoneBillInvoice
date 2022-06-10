var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
    name: 'glCodesNonVer',
    table: 'gl_inv_glseg_codes_nonver',
    relations: {
        belongsTo: {
            dictionary: {
                localField: "segment_name",
                localKey: "segment"
            }
        }
    },
    afterUpdate: function (resource, data, cb) {
        History.add("glCodesNonVer", "update", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterCreate: function (resource, data, cb) {
        History.add("glCodesNonVer", "create", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterDestroy: function (resource, data, cb) {
        History.add("glCodesNonVer", "destroy", data.id, JSON.stringify(resource.vendor));
        if (cb) {
            cb(null, data);
        }
    },
});
