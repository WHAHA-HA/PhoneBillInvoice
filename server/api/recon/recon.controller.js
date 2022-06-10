'use strict';

var Charge = require('../charge/charge.model');
var ce = require('cloneextend');
var db = require('../../components/db')();


exports.invoices = function (req, res, next) {
    var knex = db.adapter.query;
    var month = req.query.month;
    var limit = req.query.limit ? req.query.limit : '';
    var offset = req.query.limit ? req.query.offset : '';
    var sql = "select distinct sp_serv_id, c.vendor_id, c.acct_level_1 from cost_invoice_charge c join cost_invoice_facepage h on c.invoice_id = h.invoice_id where sp_serv_id not in\n\
        (select distinct unique_id from inventory_detail where unique_id is not null) \n\
        and EXTRACT(month FROM inv_date) = EXTRACT(month FROM '" + month + "'::DATE)\n\
        and EXTRACT(year FROM inv_date) = EXTRACT(year FROM '" + month + "'::DATE)";
    if (limit) {
        sql += " limit " + limit;
    }

    if (offset) {
        sql += " offset " + offset;
    }

    var countSql = "select count(distinct sp_serv_id) from cost_invoice_charge c join cost_invoice_facepage h on c.invoice_id = h.invoice_id where sp_serv_id not in\n\
        (select distinct unique_id from inventory_detail where unique_id is not null) \n\
        and EXTRACT(month FROM inv_date) = EXTRACT(month FROM '" + month + "'::DATE)\n\
        and EXTRACT(year FROM inv_date) = EXTRACT(year FROM '" + month + "'::DATE)";
    var rtr = {};
    knex.raw(sql)
            .then(function (result) {
                rtr['items'] = result.rows;
                return knex.raw(countSql);
            })
            .then(function (result) {
                rtr['total'] = parseInt(result.rows[0].count);
                res.send(rtr);
            });
};

exports.inventories = function (req, res, next) {

    var knex = db.adapter.query;

    var limit = req.query.limit ? req.query.limit : '';
    var offset = req.query.limit ? req.query.offset : '';
    var sql = "select i.*, site_a.site_id as site_a, site_z.site_id as site_z  from inventory_detail i join common_dictionary d on type_id = d.id left outer join appdata_site site_a on i.site_a_id = site_a.id left outer join appdata_site site_z on i.site_z_id = site_z.id where unique_id not in (select distinct sp_serv_id from cost_invoice_charge c where sp_serv_id is not null) and custom_key = 'ckt'";
    if (limit) {
        sql += " limit " + limit;
    }

    if (offset) {
        sql += " offset " + offset;
    }
    var countSql = "select count(*) from inventory_detail i join common_dictionary d on type_id = d.id left outer join appdata_site site_a on i.site_a_id = site_a.id left outer join appdata_site site_z on i.site_z_id = site_z.id where unique_id not in (select distinct sp_serv_id from cost_invoice_charge c where sp_serv_id is not null) and custom_key = 'ckt'";

    var rtr = {};
    knex.raw(sql)
            .then(function (result) {
                rtr['items'] = result.rows;
                return knex.raw(countSql);
            })
            .then(function (result) {
                rtr['total'] = parseInt(result.rows[0].count);
                res.send(rtr);
            });
    ;
};
