var db = require('../../components/db')();

module.exports = db.store.defineResource({
  name: 'ticket',
  table: 'common_ticket',
  computed: {
    id: ['id', function (id) {
      var t = id.toString();
      while (t.length < 7) {
        t = "0" + t;
      }
      return t;
    }]
  },
  relations: {
    belongsTo: {
      user: {
        localField: 'assignee',
        localKey: 'assignee_id'
      },
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id'
      }
    },
    hasOne: {
      dictionary: {
        localField: 'type',
        localKey: 'type_id'
      }
    }
  }
});
