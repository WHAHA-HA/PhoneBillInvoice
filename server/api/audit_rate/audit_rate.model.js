/**
 * Created by bear on 2/26/16.
 */
var db = require('../../components/db')();

module.exports = db.store.defineResource({
  name: 'audit_rate',
  table: 'cost_audit_rate'
});
