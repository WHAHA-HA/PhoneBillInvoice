'use strict';

var GlCodesNonVer = require('./glcodes.model');
var db = require('../../components/db')();
var Promise = require('es6-promise').Promise;


exports.index = function (req, res, next) {
    var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};

    GlCodesNonVer.findAllWithPaging(query, {with : ["dictionary"]})
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.show = function (req, res, next) {
    GlCodesNonVer.find(req.params.id, {with : ["dictionary"]})
            .then(function (obj) {
                res.send(obj);
            })
            .catch(next);
};


exports.create = function (req, res, next) {

    var input = req.body;
    GlCodesNonVer.findAll({where: {
            segment_value: {'==': input.segment_value},
            segment: {'==': input.segment}
        }
    }).then(function (data) {
        if (data.length > 0) {
            res.sendStatus(406);
        } else {
            GlCodesNonVer.create(input)
                    .then(function (obj) {
                        res.send(obj);
                    })
                    .catch(next);
        }
    });
};

exports.update = function (req, res, next) {

    var input = req.body,
            id = req.params.id;
    GlCodesNonVer.findAll({where: {
            id : {'!==':id},
            segment_value: {'==': input.segment_value},
            segment: {'==': input.segment}
        }
    }).then(function (data) {
        if (data.length > 0) {
            res.sendStatus(406);
        } else {
            GlCodesNonVer.update(id, input)
                    .then(function (obj) {
                        res.send(obj);
                    })
                    .catch(next);
        }
    });
};


exports.delete = function (req, res, next) {
    GlCodesNonVer.destroyAll({
        where: {
            id: {
                'in': req.body.ids
            }
        }})
            .then(function () {
                res.sendStatus(200);
            })
            .catch(next);

};

exports.invoiceSummary = function (req, res, next) {
    var obj = {};
    var knex = db.adapter.query;
    var sql = "select sum(chg_amt), count(*) from cost_invoice_charge where invoice_id = " + req.params.id;
    knex.raw(sql).then(function (result) {
        obj.totalCharges = result.rows[0].count;
        obj.sumTotalCharges = result.rows[0].sum;
        var sql = "select count(*) as total, sum(full_chg_amt) as sum, count(distinct chg_id) as number from gl_output where chg_id in (select id from cost_invoice_charge where invoice_id =" + req.params.id + ")";
        knex.raw(sql).then(function (result) {
            obj.totalGlApplied = result.rows[0].total;
            obj.sumGlApplied = result.rows[0].sum;
            obj.countGlApplied = result.rows[0].number;
            res.send(obj);
        });
    }, function (err) {
        res.send(err);
    });
};