var db = require('../../components/db')();
var History = require('../history/history.model');

var Audit = db.store.defineResource({
  name: 'audit',
  table: 'cost_audit',
  afterUpdate: function (resource, data, cb) {
    History.add("audit", "update", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("audit", "create", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  computed: {
    calculated_amount: ['charge.chg_amt', 'disputed_amount', function (total, disputed) {

      return total - disputed;

    }]
  },
  relations: {
    belongsTo: {
      charge: {
        localField: 'charge',
        localKey: 'charge_id'
      },
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id'
      },
      account: {
        localField: 'account',
        localKey: 'account_id'
      }
    },
    hasOne: {
      dictionary: {
        localField: 'invoice_type',
        localKey: 'invoice_type_id'
      }
    }
  }
});


module.exports = Audit;
