var db = require('../../components/db')();

var DisputeCategory = db.store.defineResource({
  name: 'disputeCategory',
  table: 'cost_dispute_category'
});


module.exports = DisputeCategory;
