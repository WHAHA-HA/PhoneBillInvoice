var db = require('../../components/db')();

var DisputeCharge = db.store.defineResource({
  name: 'dispute_charge',
  table: 'cost_dispute_charge',
//  computed: {
//    calculated_amount: ['disputed_amount', 'charge.chg_amt', function (disputed, total) {
//
//      return total - disputed;
//
//    }],
//    final_dispute: ['final_charge', 'charge.chg_amt', function (final, total) {
//
//      return total - final;
//
//    }]
//  },
  relations: {
    belongsTo: {
      dispute: {
        localField: 'dispute',
        localKey: 'dispute_id'
      },
      charge: {
        localField: 'charge',
        localKey: 'charge_id'
      }
    }
  }
});



module.exports = DisputeCharge;
