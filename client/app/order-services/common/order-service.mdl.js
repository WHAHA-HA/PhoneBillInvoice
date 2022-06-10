(function () {
  'use strict';

  angular.module('lcma')
    .factory('OrderService', function (DS, HistoryRefresh) {

      function transform(instance) {
        if(instance.id > 0) {
          instance.foc_rec_date = instance.foc_rec_date ? (new Date(instance.foc_rec_date)) : null;
          instance.install_date = instance.install_date ? (new Date(instance.install_date)) : null;
          instance.des_due_date = instance.des_due_date ? (new Date(instance.des_due_date)) : null;
          instance.accept_date = instance.accept_date ? (new Date(instance.accept_date)) : null;
          instance.foc_date = instance.foc_date ? (new Date(instance.foc_date)) : null;
          instance.ack_date = instance.ack_date ? (new Date(instance.ack_date)) : null;

          if (instance.inventory) {
            instance.inventory.install_date = instance.inventory.install_date ? (new Date(instance.inventory.install_date)) : null;
            instance.inventory.exp_date = instance.inventory.exp_date ? (new Date(instance.inventory.exp_date)) : null;
            instance.inventory.disc_date = instance.inventory.disc_date ? (new Date(instance.inventory.disc_date)) : null;
            instance.inventory.term_date = instance.inventory.term_date ? (new Date(instance.inventory.term_date)) : null;
          }
        }
      }

      return DS.defineResource({
        name: 'order-service',
         afterUpdate:  function (resource, data, cb) {
            HistoryRefresh.refresh();
            if (cb) {
                cb(null, data);
            }
        },
        afterCreate:  function (resource, data, cb) {
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
        afterInject: function (resource, data) {

          if(angular.isArray(data) && data.length && data[0].$total) {
            var meta = data.shift();
            data.$total = meta.$total;
          }

          if(angular.isArray(data)) {
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
