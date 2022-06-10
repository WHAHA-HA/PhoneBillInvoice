var db = require('../../components/db')();

var NoteCharge = db.store.defineResource({
  name: 'note_charge',
  table: 'cost_invoice_charge_note',
  relations: {
    belongsTo: {
      note: {
        localField: 'note',
        localKey: 'note_id'
      },
      charge: {
        localField: 'charge',
        localKey: 'charge_id'
      }
    }
  }
});



module.exports = NoteCharge;
