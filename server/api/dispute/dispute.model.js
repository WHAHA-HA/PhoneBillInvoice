var db = require('../../components/db')();
var History = require('../history/history.model');

var Dispute = db.store.defineResource({
  name: 'dispute',
  table: 'cost_dispute_detail',
  afterUpdate: function (resource, data, cb) {
    var action = "update";
    if(resource.customHistory){
        action = resource.customHistory.action;
    }
    History.add("dispute",action , data.id, JSON.stringify(data), data.invoice_id, 'invoice');
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    if(!resource.noHistory){
        History.add("dispute", "create", data.id, JSON.stringify(data), data.invoice_id, 'invoice');
    }
    if (cb) {
        cb(null, data);
    }
  },
  computed: {
    charges: ['dispute_charges', function (items) {
      var charges = [];

      if (items) {
        items.forEach(function (uir) {
          charges.push(uir.charge);
        });
      }
      return charges;
    }],
    total_amount: ['charges', function (charges) {

      var amount = 0;
      charges.forEach(function (x) {          
        amount += parseFloat(x.chg_amt);
      });

      return amount;

    }],
    disputed_amount: ['dispute_charges', function (charges) {

      var amount = 0;
      charges.forEach(function (x) {
        var t = x.disputed_amount;
        amount += parseFloat(t?t:0);
      });

      return amount;

    }],
    dispute_value_awarded: ['dispute_charges', function (charges) {

      var amount = 0;
      charges.forEach(function (x) {
        var t = x.dispute_value_awarded;
        amount += parseFloat(t?t:0);
      });

      return amount;

    }],
    payback_amount: ['dispute_charges', 'total_amount', 'calculated_amount', 'dispute_value_awarded', 'dispute_withheld',
        function (charges, billed_charges, calculated_charges, dispute_value_awarded, dispute_withheld) {
            var dispute_withheld = 0;
            charges.forEach(function (x) {
                if (x.dispute_withheld) {
                    dispute_withheld++;
                }
            });
            var amount = 0;
            if ((dispute_withheld === charges.length) && (dispute_value_awarded < (billed_charges - calculated_charges))) {
                amount = (billed_charges - calculated_charges) - dispute_value_awarded;
            }
            return amount;

        }],
    calculated_amount: ['dispute_charges', function (charges) {
            
      var amount = 0;
      charges.forEach(function (x) {
        var t = x.calculated_amount;
        amount += parseFloat(t?t:0);
      });

      return amount;

    }],
    dispute_withheld: ['dispute_charges', function (charges) {

      var amount = 0;
      charges.forEach(function (x) {
        if (x.dispute_withheld) {
          amount ++;
        }
      });

      return amount;

    }]
  },
  relations: {
    belongsTo: {
      dictionary: {
        localField: 'status_obj',
        localKey: 'status'
      },
      user: {
        localField: 'user',
        localKey: 'user_id',
        parent: true
      },
      invoice: {
        localField: 'invoice',
        localKey: 'invoice_id',
        parent: true
      },
      disputeCategory: {
        localField: 'category',
        localKey: 'category_id'
      }
    },
    hasMany: {
      dispute_charge: {
        localField: 'dispute_charges',
        foreignKey: 'dispute_id'
      }
    },
    hasOne: {
      
    }
  }
});
/* TODO: delete
Dispute.createHistoryEntry = function (instance, actionKey, data) {

  var userId = User.currentId();

  var defaults = {
    entity_type: 'dispute',
    entity_id: instance.id,
    created_at: new Date(),
    created_by: userId,
    action_key: actionKey
  };

  var entry = ce.cloneextend(defaults, data);

  return History.create(entry);

};*/


module.exports = Dispute;
