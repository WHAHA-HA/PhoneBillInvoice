(function () {
  'use strict';

  angular.module('lcma')
    .factory('Invoice', function (DS, HistoryRefresh) {

      function transform(instance) {

        if (instance.id > 0) {
            instance.date_issued = instance.date_issued ? (new Date(instance.date_issued)) : null;
            instance.pmts_rcvd = instance.pmts_rcvd ? instance.pmts_rcvd : 0;
            instance.prev_bill_amt = instance.prev_bill_amt ? instance.prev_bill_amt : 0;
            instance.bal_fwd_adj = instance.bal_fwd_adj ? instance.bal_fwd_adj : 0;
            instance.bal_fwd = instance.bal_fwd ? instance.bal_fwd : 0;
            instance.tot_occ_chgs = instance.tot_occ_chgs ? instance.tot_occ_chgs : 0;
            instance.tot_mrc_chgs = instance.tot_mrc_chgs ? instance.tot_mrc_chgs : 0;
            instance.tot_usage_chgs = instance.tot_usage_chgs ? instance.tot_usage_chgs : 0;
            instance.tot_taxsur = instance.tot_taxsur ? instance.tot_taxsur : 0;
            instance.tot_disc_amt = instance.tot_disc_amt ? instance.tot_disc_amt : 0;
            instance.tot_new_chg_adj = instance.tot_new_chg_adj ? instance.tot_new_chg_adj : 0;
            instance.tot_new_chgs = instance.tot_new_chgs ? instance.tot_new_chgs : 0;
            instance.tot_amt_due_adj = instance.tot_amt_due_adj ? instance.tot_amt_due_adj : 0;
            instance.tot_amt_due = instance.tot_amt_due ? instance.tot_amt_due : 0;
        }

      }

      return DS.defineResource({
        name: 'invoice',
        afterCreate:  function (resource, data, cb) {
            HistoryRefresh.refresh();
            if (cb) {
                cb(null, data);
            }
        },
        afterUpdate:  function (resource, data, cb) {
            HistoryRefresh.refresh();
            if (cb) {
                cb(null, data);
            }
        },
        afterDestroy:  function (resource, data, cb) {
            HistoryRefresh.refresh();
            if (cb) {
                cb(null, data);
            }
        },
        computed: {
          tot_amt: ['tot_amt_due', 'tot_usage_chgs', function (amt, chgs) {
            if (!amt) amt = 0;
            if (!chgs) chgs = 0;
            return parseFloat(amt) + parseFloat(chgs);
          }],
          total: ['tot_amt', 'amount_witheld', function (amt, wh) {
            if (!amt) amt = 0;
            if (!wh) wh = 0;
            return parseFloat(amt) - parseFloat(wh);
          }],
          sp_vendor_logo_url: ['vendor', function (vendor) {
            if (!vendor || !vendor.name) {
              return "";
            }
            return vendor.name ? '/assets/img/vendor/' + vendor.name.toLowerCase() + '.png' : vendor.name;
          }]
        },
        actions: {
          stat: {
            method: 'GET'
          },
            facepage:{
                method: 'GET'
            }
        },
        afterInject: function (resource, data) {

          if (angular.isArray(data) && data.length && data[0].$total) {
            var meta = data.shift();
            data.$total = meta.$total;
          }

          if (angular.isArray(data)) {
            angular.forEach(data, function (instance) {
              transform(instance);
            });
          }
          else {
            transform(data);
          }

          return data;
        }
      });
    });

}());
