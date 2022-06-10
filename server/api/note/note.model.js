var db = require('../../components/db')();

var Note = db.store.defineResource({
  name: 'note',
  table: 'common_note',
  computed: {
    charges: ['note_charges', function (items) {
      var charges = [];

      if(items) {
        items.forEach(function (uir) {
          charges.push(uir.charge);
        });
      }
      return charges;
    }]
  },
  relations: {
    belongsTo: {
      user: {
        localField: 'user',
        localKey: 'user_id',
        parent: true
      }
    },
    hasMany: {
      note: {
        localField: 'notes',
        foreignKey: 'parent_id'
      },
      note_charge: {
        localField: 'note_charges',
        foreignKey: 'note_id'
      }
    }
  }
});


module.exports = Note;
