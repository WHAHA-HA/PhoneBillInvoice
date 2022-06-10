var db = require('../../components/db')();

var InvoiceStatusHistory = db.store.defineResource({
  name: 'inv_status_history',
  table: 'cost_invoice_status_history'
});

module.exports = InvoiceStatusHistory;
