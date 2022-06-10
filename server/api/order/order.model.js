var db = require('../../components/db')();
var OrderService = require('../order-service/order-service.model');
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'order',
  table: 'order_header',
  afterUpdate: function (resource, data, cb) {
    History.add("order", "update", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("order", "create", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  computed: {
    id: ['id', function (id) {
            var t = id.toString();
            while (t.length < 7) {
                t = "0" + t;
            }
            return t;
        }],
    tot_svc_items: ['services', function (services) {
       var val = 0;
       if(services){
         val = services.filter(function(x){
             return x.active;
         }).length;
       }
       return val;
    }],
    est_mrc: ['services', function (services) {
       var val = 0;
       for(var i in services){
           if(services[i].inventory && services[i].inventory.est_mrc && services[i].active)
           val += Number(services[i].inventory.est_mrc);
       }
      return val;
    }],
    est_nrc: ['services', function (services) {
       var val = 0;
       for(var i in services){
           if(services[i].inventory && services[i].inventory.est_nrc && services[i].active)
           val += Number(services[i].inventory.est_nrc);
       }
      return val;
    }]
  },
  relations: {
    hasOne: {
      dictionary: {
        localField: 'status',
        localKey: 'status_id'
      }
    },
    belongsTo: {
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id'
      },
      dictionary: {
        localField: 'type',
        localKey: 'type_id'
      },
      user: [{

          localField: 'requester',
          localKey: 'requester_id'
        },{
            localField: 'processor',
            localKey: 'processor_id'
        },{
            localField: 'approver',
            localKey: 'approver_id'
        }
      ]
    },
    hasMany: {
      order_service: {
        localField: 'services',
        foreignKey: 'order_id'
      }
    }
  }
});
