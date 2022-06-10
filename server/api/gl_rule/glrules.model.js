var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
    name: 'GlRules',
    table: 'gl_rules',
    relations: {
        hasMany: {
            GlRulesGlCodes: {
                foreignKey: "rule_id",
                localField: "gl_rules_glcodes"
            }
        }
    },
    afterUpdate: function (resource, data, cb) {
        History.add("GlRules", "update", data.rule_id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterCreate: function (resource, data, cb) {
        console.log("SAVED")
        History.add("GlRules", "create", data.rule_id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterDestroy: function (resource, data, cb) {
        History.add("GlRules", "destroy", data.rule_id, null);
        if (cb) {
            cb(null, data);
        }
    },
});
