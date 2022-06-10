var db = require('../../components/db')();

module.exports = db.store.defineResource({
  name: 'setting',
  table: 'security_user_setting'
});
