var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
    name: 'glString',
    table: 'gl_strings',
    relations: {
        belongsTo: {
            user: {
                localField: "user",
                localKey: "user_created"
            },
            glCodesNonVer: [
                {
                    localField: "segment1_obj",
                    localKey: "segment1"
                },
                {
                    localField: "segment2_obj",
                    localKey: "segment2"
                },
                {
                    localField: "segment3_obj",
                    localKey: "segment3"
                },
                {
                    localField: "segment4_obj",
                    localKey: "segment4"
                },
                {
                    localField: "segment5_obj",
                    localKey: "segment5"
                },
                {
                    localField: "segment6_obj",
                    localKey: "segment6"
                },
                {
                    localField: "segment7_obj",
                    localKey: "segment7"
                },
                {
                    localField: "segment8_obj",
                    localKey: "segment8"
                },
                {
                    localField: "segment9_obj",
                    localKey: "segment9"
                },
                {
                    localField: "segment10_obj",
                    localKey: "segment10"
                }
            ]
        }
    },
    computed: {
        full_string_formatted: ['segment1_obj', 'segment2_obj', 'segment3_obj', 'segment4_obj', 'segment5_obj', 'segment6_obj', 'segment7_obj', 'segment8_obj', 'segment9_obj', 'segment10_obj',
            function (s1, s2, s3, s4, s5, s6, s7, s8, s9, s10) {
                var t = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
                return t.filter(function (o) {
                    return o != null;
                }).map(function (o) {
                    return o.segment_value;
                }).join("-");     //TODO: set string separator in global config  
            }],
         full_string_text: ['segment1_obj', 'segment2_obj', 'segment3_obj', 'segment4_obj', 'segment5_obj', 'segment6_obj', 'segment7_obj', 'segment8_obj', 'segment9_obj', 'segment10_obj',
            function (s1, s2, s3, s4, s5, s6, s7, s8, s9, s10) {
                var t = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
                return t.filter(function (o) {
                    return o != null;
                }).map(function (o) {
                    return o.segment_desc;
                }).join("-");     //TODO: set string separator in global config       
            }]
    },
    afterUpdate: function (resource, data, cb) {
        History.add("gl_strings", "update", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterCreate: function (resource, data, cb) {
        History.add("gl_strings", "create", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterDestroy: function (resource, data, cb) {
        History.add("gl_strings", "destroy", data.id, JSON.stringify(resource.vendor));
        if (cb) {
            cb(null, data);
        }
    }
});
