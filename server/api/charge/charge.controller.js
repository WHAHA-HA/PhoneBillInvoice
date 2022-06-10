/**
 *
 */

'use strict';

var Charge = require('../charge/charge.model');
var ce = require('cloneextend');
var db = require('../../components/db')();

/**
 * GET  /charges ->  index
 */
exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};
  var vendor = req.query.vendor ? JSON.parse(req.query.vendor) : ''; // it contains name like : 'Verizon' not id
  var prevMonth = req.query.prevMonth ? JSON.parse(req.query.prevMonth) : ''; // it contains last [prevMonth] Month
  var auditFilter = req.query.auditFilter ? JSON.parse(req.query.auditFilter) : ''; // it contains true or empty
  var fields = req.query.fields ? JSON.parse(req.query.fields) : '*'; // list of fields
  var knex = db.adapter.query;

  if ('true' === auditFilter) {
    //select * from cost_invoice_charge where invoice_id in (select distinct(invoice_id) as inv_id, inv_date from cost_invoice_facepage where cost_invoice_facepage.sp_name='VERIZON' and 1=1 order by inv_date desc limit 3)
    var whereField = '1';
    var whereFieldVal = '1';

    var promise = knex('cost_invoice_facepage')
      .distinct('invoice_id')
      .select('inv_date');


    if (vendor) {
      promise = promise.where('sp_name', vendor);
    }

    promise.orderBy('inv_date', 'desc');

    if (prevMonth) {
      promise = promise.limit(prevMonth).as('t1');
    }

    promise.then(function(rows) {

      var invoiceIds = [];

      for (var i = 0; i< rows.length; i++) {
        invoiceIds.push(rows[i].invoice_id);
      }

      knex.select(fields).from('cost_invoice_charge')
        .whereIn('invoice_id', invoiceIds)
        .then(function(result) {
          res.send(result);
        })
        .catch(next);
    })
    .catch(next);

  }
  else {
    Charge.findAllWithPaging(query, {with: ['charge_disputes', 'note_charges', 'invoice']})
      .then(function (result) {
        res.send(result);
      })
      .catch(next);
  }

};

/**
 * GET  /charges/filters ->  filters
 */
exports.filters = function (req, res, next) {

    var knex = db.adapter.query;
    var query = req.query.filter ? JSON.parse(req.query.filter) : {};

    var vendor_ids = (query.where && query.where.vendor_ids) ?  query.where.vendor_ids : '';
    var account_numbers = (query.where && query.where.account_numbers) ?  query.where.account_numbers : '';
    var start_date = (query.where && query.where.start_date) ?  query.where.start_date : '';
    var end_date = (query.where && query.where.end_date) ?  query.where.end_date : '';

    var sp_name = (query.where && query.where.sp_name) ?  query.where.sp_name : '';
    var acct_level_1 = (query.where && query.where.acct_level_1) ?  query.where.acct_level_1 : '';
    var sp_inv_num = (query.where && query.where.sp_inv_num) ?  query.where.sp_inv_num : '';
    var inv_date = (query.where && query.where.inv_date) ?  query.where.inv_date : '';
    //var inv_status = (query.where && query.where.inv_status) ?  query.where.inv_status : '';
    var acct_level_2 = (query.where && query.where.acct_level_2) ?  query.where.acct_level_2 : '';
    var chg_class = (query.where && query.where.chg_class) ?  query.where.chg_class : '';
    var sp_serv_id = (query.where && query.where.sp_serv_id) ?  query.where.sp_serv_id : '';
    var chg_code_1 = (query.where && query.where.chg_code_1) ?  query.where.chg_code_1 : '';
    var chg_desc_1 = (query.where && query.where.chg_desc_1) ?  query.where.chg_desc_1 : '';
    var chg_code_2 = (query.where && query.where.chg_code_2) ?  query.where.chg_code_2 : '';
    var chg_desc_2 = (query.where && query.where.chg_desc_2) ?  query.where.chg_desc_2 : '';
    var chg_qty1_billed = (query.where && query.where.chg_qty1_billed) ?  query.where.chg_qty1_billed : '';
    var chg_rate = (query.where && query.where.chg_rate) ?  query.where.chg_rate : '';
    var chg_amt = (query.where && query.where.chg_amt) ?  query.where.chg_amt : '';
    var svc_establish_date = (query.where && query.where.svc_establish_date) ?  query.where.svc_establish_date : '';
    var end_chg_date = (query.where && query.where.end_chg_date) ?  query.where.end_chg_date : '';
    var beg_chg_date = (query.where && query.where.beg_chg_date) ?  query.where.beg_chg_date : '';
    var info_only_ind = (query.where && query.where.info_only_ind) ?  query.where.info_only_ind : '';
    var fac_bw = (query.where && query.where.fac_bw) ?  query.where.fac_bw : '';
    var call_type = (query.where && query.where.call_type) ?  query.where.call_type : '';
    var product_type = (query.where && query.where.product_type) ?  query.where.product_type : '';
    var dir_ind = (query.where && query.where.dir_ind) ?  query.where.dir_ind : '';
    var jur = (query.where && query.where.jur) ?  query.where.jur : '';
    var chg_qty1_type = (query.where && query.where.chg_qty1_type) ?  query.where.chg_qty1_type : '';
    var chg_qty1_allowed = (query.where && query.where.chg_qty1_allowed) ?  query.where.chg_qty1_allowed : '';
    var chg_qty1_used = (query.where && query.where.chg_qty1_used) ?  query.where.chg_qty1_used : '';



    var limit = query.limit  ?  query.limit : '';
    var offset = query.limit  ?  query.offset : '';



    var sql = 'SELECT ' +
    'cost_invoice_header.id as header_id, ' +
    'cost_invoice_facepage.id as facepage_id, ' +
    'cost_invoice_facepage.sp_inv_num as sp_inv_num, ' +
    'cost_invoice_facepage.inv_date as inv_date, ' +
    'cost_invoice_facepage.due_date as due_date, ' +
    'cost_invoice_facepage.tot_amt_due as tot_amt_due, ' +
    'cost_invoice_facepage.tot_new_chgs as tot_new_chgs, ' +
    'cost_invoice_facepage.tot_mrc_chgs as tot_mrc_chgs, ' +
    'cost_invoice_facepage.tot_occ_chgs as tot_occ_chgs, ' +
    'cost_invoice_facepage.tot_usage_chgs as tot_usage_chgs, ' +
    'cost_invoice_facepage.tot_disc_amt as tot_disc_amt, ' +
    'cost_invoice_facepage.tot_new_chg_adj as tot_new_chg_adj, ' +
    'cost_invoice_facepage.bal_fwd as bal_fwd, ' +
    'cost_invoice_charge.* FROM cost_invoice_header ' +
    '  INNER JOIN cost_invoice_facepage ON cost_invoice_header.id = cost_invoice_facepage.invoice_id ' +
    '  INNER JOIN cost_invoice_charge ON cost_invoice_header.id = cost_invoice_charge.invoice_id ' +
    '  WHERE cost_invoice_facepage.acct_level = 1';

    /**
    * returns total count of record
    * @type {string}
    */
    var countSql = 'SELECT ' +
    'count(cost_invoice_header.id) FROM cost_invoice_header ' +
    '  INNER JOIN cost_invoice_facepage ON cost_invoice_header.id = cost_invoice_facepage.invoice_id ' +
    '  INNER JOIN cost_invoice_charge ON cost_invoice_header.id = cost_invoice_charge.invoice_id ' +
    '  WHERE cost_invoice_facepage.acct_level = 1';

    if (start_date) {
        sql += " AND cost_invoice_facepage.inv_date > '" + start_date + "' ";
        countSql += " AND cost_invoice_facepage.inv_date > '" + start_date + "' ";
    }

    if (end_date) {
        sql += " AND cost_invoice_facepage.inv_date < '" + end_date + "' ";
        countSql += " AND cost_invoice_facepage.inv_date < '" + end_date + "' ";
    }

    if (account_numbers && account_numbers.length > 0) {
        sql += " AND cost_invoice_facepage.acct_level_1 in (" + "'" + account_numbers.join("','") + "'" + ") ";
        countSql += " AND cost_invoice_facepage.acct_level_1 in (" + "'" + account_numbers.join("','") + "'" + ") ";
    }


    if (vendor_ids && vendor_ids.length > 0) {
        sql += " AND cost_invoice_facepage.vendor_id in (" + vendor_ids.toString() + ") ";
        countSql += " AND cost_invoice_facepage.vendor_id in (" + vendor_ids.toString() + ") ";
    }

    if (sp_name) {
        sql += " AND lower(cost_invoice_charge.sp_name) like lower('" + sp_name.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.sp_name) like lower('" + sp_name.likei + "') ";
    }

    if (acct_level_1) {
        sql += " AND lower(cost_invoice_charge.acct_level_1) like lower('" + acct_level_1.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.acct_level_1) like lower('" + acct_level_1.likei + "') ";
    }

    if (sp_inv_num) {
        sql += " AND lower(cost_invoice_facepage.sp_inv_num) like lower('" + sp_inv_num.likei + "') ";
        countSql += " AND lower(cost_invoice_facepage.sp_inv_num) like lower('" + sp_inv_num.likei + "') ";
    }

    //if (inv_status && inv_status.length > 0) {
    //  sql += " AND cost_invoice_facepage.vendor_id in (" + vendor_ids.toString() + ") ";
    //  countSql += " AND cost_invoice_facepage.vendor_id in (" + vendor_ids.toString() + ") ";
    //}

    if (inv_date) {

        if (inv_date['>']) {
            sql += " AND cost_invoice_facepage.inv_date > '" + inv_date['>'] + "' ";
            countSql += " AND cost_invoice_facepage.inv_date > '" + inv_date['>'] + "' ";
        }

        if (inv_date['<']) {
            sql += " AND cost_invoice_facepage.inv_date < '" + inv_date['<'] + "' ";
            countSql += " AND cost_invoice_facepage.inv_date < '" + inv_date['<'] + "' ";
        }
    }

    if (acct_level_2) {
        sql += " AND lower(cost_invoice_charge.acct_level_2) like lower('" + acct_level_2.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.acct_level_2) like lower('" + acct_level_2.likei + "') ";
    }

    if (chg_class && chg_class.in && chg_class.in.length > 0) {
        sql += " AND cost_invoice_charge.chg_class in (" + "'" + chg_class.in.join("','") + "'" + ") ";
        countSql += " AND cost_invoice_charge.chg_class in (" + "'" + chg_class.in.join("','") + "'" + ") ";
    }

    if (sp_serv_id) {
        if (sp_serv_id.likei) {
            sql += " AND lower(cost_invoice_charge.sp_serv_id) like lower('" + sp_serv_id.likei + "') ";
            countSql += " AND lower(cost_invoice_charge.sp_serv_id) like lower('" + sp_serv_id.likei + "') ";
        }
        else {
            sql += " AND lower(cost_invoice_charge.sp_serv_id) = lower('" + sp_serv_id['='] + "') ";
            countSql += " AND lower(cost_invoice_charge.sp_serv_id) = lower('" + sp_serv_id['='] + "') ";
        }

    }

    if (chg_code_1) {
        sql += " AND lower(cost_invoice_charge.chg_code_1) like lower('" + chg_code_1.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.chg_code_1) like lower('" + chg_code_1.likei + "') ";
    }

    if (chg_desc_1) {
        sql += " AND lower(cost_invoice_charge.chg_desc_1) like lower('" + chg_desc_1.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.chg_desc_1) like lower('" + chg_desc_1.likei + "') ";
    }

    if (chg_code_2) {
        sql += " AND lower(cost_invoice_charge.chg_code_2) like lower('" + chg_code_2.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.chg_code_2) like lower('" + chg_code_2.likei + "') ";
    }

    if (chg_desc_2) {
        sql += " AND lower(cost_invoice_charge.chg_desc_2) like lower('" + chg_desc_2.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.chg_desc_2) like lower('" + chg_desc_2.likei + "') ";
    }

    if (chg_qty1_billed) {

        if (chg_qty1_billed['>']) {
          sql += " AND cost_invoice_charge.chg_qty1_billed > " + chg_qty1_billed['>'] + " ";
          countSql += " AND cost_invoice_charge.chg_qty1_billed > " + chg_qty1_billed['>'] + " ";
        }

        if (chg_qty1_billed['<']) {
          sql += " AND cost_invoice_charge.chg_qty1_billed < " + chg_qty1_billed['<'] + " ";
          countSql += " AND cost_invoice_charge.chg_qty1_billed < " + chg_qty1_billed['<'] + " ";
        }

        if (chg_qty1_billed['!=']) {
          sql += " AND cost_invoice_charge.chg_qty1_billed != " + chg_qty1_billed['!='] + " ";
          countSql += " AND cost_invoice_charge.chg_qty1_billed != " + chg_qty1_billed['!='] + " ";
        }

        if (chg_qty1_billed['==']) {
          sql += " AND cost_invoice_charge.chg_qty1_billed = " + chg_qty1_billed['=='] + " ";
          countSql += " AND cost_invoice_charge.chg_qty1_billed = " + chg_qty1_billed['=='] + " ";
        }
    }

    if (chg_rate) {
        if (chg_rate['>']) {
          sql += " AND cost_invoice_charge.chg_rate > " + chg_rate['>'] + " ";
          countSql += " AND cost_invoice_charge.chg_rate > " + chg_rate['>'] + " ";
        }

        if (chg_rate['<']) {
          sql += " AND cost_invoice_charge.chg_rate < " + chg_rate['<'] + " ";
          countSql += " AND cost_invoice_charge.chg_rate < " + chg_rate['<'] + " ";
        }

        if (chg_rate['!=']) {
          sql += " AND cost_invoice_charge.chg_rate != " + chg_rate['!='] + " ";
          countSql += " AND cost_invoice_charge.chg_rate != " + chg_rate['!='] + " ";
        }

        if (chg_rate['==']) {
          sql += " AND cost_invoice_charge.chg_rate = " + chg_rate['=='] + " ";
          countSql += " AND cost_invoice_charge.chg_rate = " + chg_rate['=='] + " ";
        }
    }

    if (chg_amt) {
        if (chg_amt['>']) {
          sql += " AND cost_invoice_charge.chg_amt > " + chg_amt['>'] + " ";
          countSql += " AND cost_invoice_charge.chg_amt > " + chg_amt['>'] + " ";
        }

        if (chg_amt['<']) {
          sql += " AND cost_invoice_charge.chg_amt < " + chg_amt['<'] + " ";
          countSql += " AND cost_invoice_charge.chg_amt < " + chg_amt['<'] + " ";
        }

        if (chg_amt['!=']) {
          sql += " AND cost_invoice_charge.chg_amt != " + chg_amt['!='] + " ";
          countSql += " AND cost_invoice_charge.chg_amt != " + chg_amt['!='] + " ";
        }

        if (chg_amt['==']) {
          sql += " AND cost_invoice_charge.chg_amt = " + chg_amt['=='] + " ";
          countSql += " AND cost_invoice_charge.chg_amt = " + chg_amt['=='] + " ";
        }
    }

    if (svc_establish_date) {

        if (svc_establish_date['>']) {
          sql += " AND cost_invoice_charge.svc_establish_date > '" + svc_establish_date['>'] + "' ";
          countSql += " AND cost_invoice_charge.svc_establish_date > '" + svc_establish_date['>'] + "' ";
        }

        if (svc_establish_date['<']) {
          sql += " AND cost_invoice_charge.svc_establish_date < '" + svc_establish_date['<'] + "' ";
          countSql += " AND cost_invoice_charge.svc_establish_date < '" + svc_establish_date['<'] + "' ";
        }
    }

    if (beg_chg_date) {

        if (beg_chg_date['>']) {
          sql += " AND cost_invoice_charge.beg_chg_date > '" + beg_chg_date['>'] + "' ";
          countSql += " AND cost_invoice_charge.beg_chg_date > '" + beg_chg_date['>'] + "' ";
        }

        if (beg_chg_date['<']) {
          sql += " AND cost_invoice_charge.beg_chg_date < '" + beg_chg_date['<'] + "' ";
          countSql += " AND cost_invoice_charge.beg_chg_date < '" + beg_chg_date['<'] + "' ";
        }
    }

    if (end_chg_date) {

        if (end_chg_date['>']) {
          sql += " AND cost_invoice_charge.end_chg_date > '" + end_chg_date['>'] + "' ";
          countSql += " AND cost_invoice_charge.end_chg_date > '" + end_chg_date['>'] + "' ";
        }

        if (end_chg_date['<']) {
            sql += " AND cost_invoice_charge.end_chg_date < '" + end_chg_date['<'] + "' ";
            countSql += " AND cost_invoice_charge.end_chg_date < '" + end_chg_date['<'] + "' ";
        }
    }

    if (info_only_ind && info_only_ind.in && info_only_ind.in.length > 0) {
        sql += " AND cost_invoice_charge.info_only_ind in (" + "'" + info_only_ind.in.join("','") + "'" + ") ";
        countSql += " AND cost_invoice_charge.info_only_ind in (" + "'" + info_only_ind.in.join("','") + "'" + ") ";
    }

    if (fac_bw) {
        sql += " AND lower(cost_invoice_charge.fac_bw) like lower('" + fac_bw.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.fac_bw) like lower('" + fac_bw.likei + "') ";
    }

    if (call_type) {
        sql += " AND lower(cost_invoice_charge.call_type) like lower('" + call_type.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.call_type) like lower('" + call_type.likei + "') ";
    }

    //if (product_type) {
    //  sql += " AND cost_invoice_charge.product_type like '" + product_type.likei + "' ";
    //  countSql += " AND cost_invoice_charge.product_type like '" + product_type.likei + "' ";
    //}

    if (dir_ind) {
        sql += " AND lower(cost_invoice_charge.dir_ind) like lower('" + dir_ind.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.dir_ind) like lower('" + dir_ind.likei + "') ";
    }

    if (jur) {
        sql += " AND lower(cost_invoice_charge.jur) like lower('" + jur.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.jur) like lower('" + jur.likei + "') ";
    }

    if (chg_qty1_type) {
        sql += " AND lower(cost_invoice_charge.chg_qty1_type) like lower('" + chg_qty1_type.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.chg_qty1_type) like lower('" + chg_qty1_type.likei + "') ";
    }

    if (chg_qty1_allowed) {
        sql += " AND lower(cost_invoice_charge.chg_qty1_allowed) like lower('" + chg_qty1_allowed.likei + "') ";
        countSql += " AND lower(cost_invoice_charge.chg_qty1_allowed) like lower('" + chg_qty1_allowed.likei + "') ";
    }


    if (chg_qty1_used) {
        if (chg_qty1_used['>']) {
            sql += " AND cost_invoice_charge.chg_qty1_used > " + chg_qty1_used['>'] + " ";
            countSql += " AND cost_invoice_charge.chg_qty1_used > " + chg_qty1_used['>'] + " ";
        }

        if (chg_qty1_used['<']) {
            sql += " AND cost_invoice_charge.chg_qty1_used < " + chg_qty1_used['<'] + " ";
            countSql += " AND cost_invoice_charge.chg_qty1_used < " + chg_qty1_used['<'] + " ";
        }

        if (chg_qty1_used['!=']) {
            sql += " AND cost_invoice_charge.chg_qty1_used != " + chg_qty1_used['!='] + " ";
            countSql += " AND cost_invoice_charge.chg_qty1_used != " + chg_qty1_used['!='] + " ";
        }

        if (chg_qty1_used['==']) {
            sql += " AND cost_invoice_charge.chg_qty1_used = " + chg_qty1_used['=='] + " ";
            countSql += " AND cost_invoice_charge.chg_qty1_used = " + chg_qty1_used['=='] + " ";
        }

    }
    
    if(query.orderBy){
        var t = query.orderBy[0];
        sql += ' ORDER BY ' + t[0] + ' ' + t[1];
    }

    if (limit) {
        sql += " limit " + limit;
    }

    if (offset) {
        sql += " offset " + offset;
    }


    /*
    * gl_fields is used for query in GL Rules grid on GL Rules Builder:
    *
    */
    var gl_fields = (query.where && query.where.gl_fields) ?  query.where.gl_fields : '';
    if(gl_fields){
        for(var i in gl_fields){
          var t = "'"+gl_fields[i].chargeType.value+"'";
          var t1 = "'"+gl_fields[i].value+"'";
          var q = gl_fields[i].operator + " " + t1;
          if(gl_fields[i].field.custom_key == 'acct_level_1')
              gl_fields[i].field.custom_key = "cost_invoice_facepage.acct_level_1";
          if(gl_fields[i].operator=='like'){
              q = "like '%"+gl_fields[i].value+"%'";
          }

          sql += ' AND cost_invoice_charge.chg_class='+t + " " + gl_fields[i].logic + " " + gl_fields[i].field.custom_key + " " + q;

        }
    }
    
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

exports.show = function (req, res, next) {

  var id = req.params.id;

  Charge.find(id)
    .then(function (result) {
      res.send(result);
    })
    .catch(next);
};
