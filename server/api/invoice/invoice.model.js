var db = require('../../components/db')();
var InvoiceHeader = require('./invoice-header.model');
var InvoiceStatusHistory = require('./invoice-status-history.model');
var History = require('../history/history.model');

var Invoice = db.store.defineResource({
  name: 'invoice',
  table: 'cost_invoice_facepage',
  afterUpdate: function (resource, data, cb) {
    History.add("invoice", "update", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("invoice", "create", data.id, JSON.stringify(data));
    if (cb) {
      cb(null, data);
    }
  },
  relations: {
    hasMany: {
      inv_status_history: {
        localField: 'status_history',
        foreignKey: 'invoice_id'
      }
    },
    belongsTo: {
      user: {
        localField: 'owner',
        localKey: 'owner_id',
        parent: true
      },
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id',
        parent: true
      },
      inv_header: {
        localField: 'header',
        localKey: 'invoice_id',
        parent: true
      }
    }
  }
});

module.exports = Invoice;
