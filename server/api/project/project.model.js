var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
    name: 'project',
    table: 'common_project',
    afterUpdate: function (resource, data, cb) {
    History.add("project", "update", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    afterCreate: function (resource, data, cb) {
        History.add("project", "create", data.id, JSON.stringify(data));
        if (cb) {
            cb(null, data);
        }
    },
    //computed: {
    //  orders: ['project_orders', function(items) {
    //    var orders = [];
    //
    //    if(items) {
    //      items.forEach(function (uir) {
    //        orders.push(uir.order);
    //      });
    //    }
    //    return orders;
    //  }]
    //},
    relations: {
        hasOne: {
          dictionary: {
            localField: 'status',
            localKey: 'status_id'
          }
        },
        hasMany: {
          project_order: {
            localField: 'project_orders',
            foreignKey: 'project_id'
          }
        },
        belongsTo: {
          employee: {
              localField: 'owner',
              localKey: 'owner_id'
          }
        }
    }
});
