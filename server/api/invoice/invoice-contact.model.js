var db = require('../../components/db')();

var InvoiceContact = db.store.defineResource({
  name: 'inv_contact',
  table: 'cost_invoice_contact',
  relations: {
    belongsTo: {
      invoice: {
        localKey: 'invoice_id',
        localField: 'invoice',
        parent: true
      }
    }
  }
});


module.exports = InvoiceContact;
