var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
    name: 'GlRulesGlCodes',
    table: 'gl_rules_glcodes',
    relations: {
        belongsTo: {
            GlRules: {
                localField: 'gl_rule',
                localKey: 'rule_id'
            },
            glString:{
                localField: 'gl_string',
                localKey: 'gl_string_id'
            }
        }
    },
    afterUpdate: function (resource, data, cb) {
        History.add("GlRulesGlCodes", "update", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterCreate: function (resource, data, cb) {
        History.add("GlRulesGlCodes", "create", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterDestroy: function (resource, data, cb) {
        History.add("GlRulesGlCodes", "destroy", data.id, null);
        if (cb) {
            cb(null, data);
        }
    },
});
