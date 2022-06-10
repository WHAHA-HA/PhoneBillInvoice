var db = require('../../components/db')();

var ProjectOrder = db.store.defineResource({
  name: 'project_order',
  table: 'project_order',
  relations: {
    belongsTo: {
      project: {
        localField: 'project',
        localKey: 'project_id'
      },
      order: {
        localField: 'order',
        localKey: 'order_id'
      }
    },
    hasOne: {
      dictionary: [
        {
          localField: 'status',
          localKey: 'status_id'
        },
        {
          localField: 'svc_item_type',
          localKey: 'svc_item_type_id'
        }
      ]
    }
  }
});


module.exports = ProjectOrder;
