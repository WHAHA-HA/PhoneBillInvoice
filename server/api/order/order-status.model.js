var db = require('../../components/db')();

module.exports = db.store.defineResource({
  name: 'order_status',
  table: 'order_status'
});
