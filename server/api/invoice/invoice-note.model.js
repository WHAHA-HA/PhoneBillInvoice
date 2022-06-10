var db = require('../../components/db')();

var InvoiceNote = db.store.defineResource({
  name: 'invoice_note',
  table: 'cost_invoice_note'
});

module.exports = InvoiceNote;
