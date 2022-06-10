var db = require('../../components/db')();
var History = require('../history/history.model');

var OrderService = db.store.defineResource({
    name: 'order_service',
    table: 'order_service',
    afterUpdate: function (resource, data, cb) {
        var operation = 'update';
        if (!data.active) {
            operation = 'destroy';
        }
        History.add("order-service", operation, data.id, JSON.stringify(data), data.order_id, 'order');
        if (cb) {
            cb(null, data);
        }
    },
    afterCreate: function (resource, data, cb) {
        History.add("order-service", "create", data.id, JSON.stringify(data), data.order_id, 'order');
        if (cb) {
            cb(null, data);
        }
    },
    computed: {
        service_id_val: ['service_id', function (id) {
            if(!id) return "";
            var t = id.toString();
            while (t.length < 3) {
                t = "0" + t;
            }
            return t;
        }]
    },
    relations: {
        belongsTo: {
            user:{
                localField: 'accepted_by_user',
                localKey: 'accepted_by'
            },
            order: {
                localField: 'order',
                localKey: 'order_id'
            },
            inventory: {
                localField: 'inventory',
                localKey: 'inventory_id'
            }
        },
        hasOne: {
            dictionary: {
                localField: 'type',
                localKey: 'type_id'
            }
        }
    }
});


module.exports = OrderService;
