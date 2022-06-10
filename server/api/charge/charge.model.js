var db = require('../../components/db')();

var Charge = db.store.defineResource({
  name: 'charge',
  table: 'cost_invoice_charge',
  relations: {
    belongsTo: {
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id',
        parent: true
      },
      invoice: {
        localField: 'invoice',
        localKey: 'invoice_id'
      },
      inv_header: {
        localField: 'header',
        localKey: 'invoice_id',
        parent: true
      }
    },
    hasMany: {
      note_charge: {
        localField: 'note_charges',
        foreignKey: 'charge_id'
      },      
      dispute_charge: {
        localField: 'charge_disputes',
        foreignKey: 'charge_id'
      }
    }
  }
});


module.exports = Charge;
