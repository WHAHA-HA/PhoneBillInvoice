var db = require('../../components/db')();

var InvoiceHeader = db.store.defineResource({
  name: 'inv_header',
  table: 'cost_invoice_header',
  computed: {
    invoice: ['invoices', function (items) {
      var invoice = null;
      if (items) {
        invoice = items[0];
      }
      return invoice;
    }]
  },
  relations: {
    hasMany: {
      invoice: {
        localField: 'invoices',
        foreignKey: 'invoice_id'
      },
      inv_charge: {

        localField: 'charges',
        foreignKey: 'invoice_id'
      }
    }
  }
});

module.exports = InvoiceHeader;
