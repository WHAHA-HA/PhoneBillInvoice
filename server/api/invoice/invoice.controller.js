/**
 *
 */

'use strict';

var Invoice = require('./invoice.model');
var InvoiceContact = require('./invoice-contact.model');
var InvoiceHeader = require('./invoice-header.model');
var InvoiceStatusHistory = require('./invoice-status-history.model');
var InvoiceNote = require('./invoice-note.model');
var InvoiceFacepage = require('./invoice-facepage.model');
var Charge = require('../charge/charge.model');
var User = require('../user/user.model');
var extend = require('cloneextend').cloneextend;
/**
 * GET  /invoices ->  index
 */
exports.index = function (req, res, next) {
  var query = {
    where: {
      acct_level: {'==': 1}
    }
  };



  query = extend(query, JSON.parse(req.query.filter));

    // Apply content filter
  if (req.filterQuery) {
    query.where = extend(query.where, req.filterQuery);
  }
    if(query.where['header.status_code']){
        delete query.where.id;
    }


    console.log(query);

    Invoice.findAllWithPaging(query, {with: ['header', 'vendor']})
    .then(function (result) {

      res.send(result)
    }).catch(next);

};

/**
 * GET  /invoices/:id/charges ->  charges
 */
exports.charges = function (req, res, next) {
  var query = {
    where: {
      uniq_id: {'==': req.params.id}
    }
  };

  Charge.findAll(query)
    .then(function (charges) {
      res.send(charges);
    })
    .catch(next);

};

/**
 * GET     /invoices/stat        ->  stat
 */
exports.stat = function (req, res, next) {
  var stat = {};
  var query = {
    where: {
      acct_level: {'==': 1}
    }
  };

  Invoice.findAll(query)
    .then(function (invoices) {

      stat = {
        new_invoices: 0,
        invoices: invoices.length
      };

      res.send(stat);

    })
    .catch(next);
};


/**
 * GET     /invoices/:id          ->  show
 */
exports.show = function (req, res, next) {
  console.log(req.params.id);
  Invoice.find(req.params.id, {with: ['inv_contact', 'owner', 'header', 'vendor', 'status_history']})
    // TODO: For some reason relations didn't work here so have to connect relations manually
    .then(function (invoice) {
      return InvoiceContact.findAll({invoice_id: invoice.id})
        .then(function (contacts) {
          invoice.contacts = contacts;
          return invoice;
        })
    })
    .then(function (invoice) {
      return InvoiceNote.findAll({invoice_id: invoice.id})
        .then(function (notes) {
          invoice.notes = notes;
          return invoice;
        })
    })
    .then(function (invoice) {
      res.send(invoice);
    })
    .catch(next);
};

/**
 * PUT     /invoices/:id          ->  update
 */
exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id,
    status_changed = false,
    status = input.status,
    note = input.note;

  Invoice.find(id, {with: ['header']})
    .then(function (invoice) {
      status_changed = invoice.header.status_code !== status;
      invoice = extend(invoice, input);
      delete invoice.status;
      delete invoice.note;
      return Invoice.update(id, invoice, {with: ['inv_contact', 'owner', 'header', 'status_history']});
    })
    .then(function (invoice) {
      if (status_changed) {
        return InvoiceHeader.update(invoice.header.id, {status_code: status})
          .then(function () {
            return InvoiceStatusHistory.create({
              invoice_id: invoice.id,
              status: status,
              changed_at: new Date(),
              changed_by_id: global.user.id,
              note: note
            }).then(function (entry) {
              invoice.status_history = invoice.status_history || [];
              invoice.status_history.push(entry);
              return invoice;
            });
          });
      }
      else {
        return invoice;
      }
    })
    .then(function (invoice) {
      res.send(invoice);
    })
    .catch(next);
};


/**
 * retrieve list of facepage
 * @param req
 * @param res
 * @param next
 */
exports.findFacepage = function (req, res, next) {

    var query = req.query.filter ? JSON.parse(req.query.filter) : {};

    InvoiceFacepage.findAllWithPaging(query)
        .then(function (result) {
            res.send(result);
        })
        .catch(next);

};
