var db = require('../../components/db')();

module.exports = db.store.defineResource({
  name: 'inventory_document_map',
  table: 'inventory_document_map',
  relations: {
    belongsTo: {
      inventory_document: {
        localField: 'inventory_document',
        localKey: 'inventory_document_id'
      }
    }
  }
});
