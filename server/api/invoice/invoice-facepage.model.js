var db = require('../../components/db')();

var InvoiceFacepage = db.store.defineResource({
  name: 'inv_facepage',
  table: 'cost_invoice_facepage'
});

module.exports = InvoiceFacepage;
