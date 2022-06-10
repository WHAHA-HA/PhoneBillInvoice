var db = require('../../components/db')();

module.exports = db.store.defineResource({
  name: 'vendor_alias',
  table: 'appdata_vendor_alias',
  relations: {
    belongsTo: {
      vendor : {
        localField: 'vendor',
        localKey: 'vendor_id'
      }
    }
  }
});
