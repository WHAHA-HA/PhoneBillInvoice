var db = require('../../components/db')();

module.exports = db.store.defineResource({
  name: 'entity_document',
  table: 'common_entity_document_map',
  relations: {
    belongsTo: {
      document: {
        localField: 'document',
        localKey: 'document_id'
      }
    }
  }
});
