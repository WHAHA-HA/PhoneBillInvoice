var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'utilization',
  table: 'usage_utilization'
});
