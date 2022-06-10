(function () {
  'use strict';

  angular.module('lcma')
    .factory('Order', function (DS, HistoryRefresh) {

      function transform(instance) {
        if(instance.id > 0) {
            instance.approve_date = instance.approve_date ? (new Date(instance.approve_date)) : null;
            instance.request_date = instance.request_date ? (new Date(instance.request_date)) : null;
            instance.send_date = instance.send_date ? (new Date(instance.send_date)) : null;
            instance.created_at = instance.created_at ? (new Date(instance.created_at)) : null;

            if (instance.services) {
            instance.services.forEach(function (service) {

              service.ack_date = service.ack_date ? (new Date(service.ack_date)) : null;
              service.foc_rec_date = service.foc_rec_date ? (new Date(service.foc_rec_date)) : null;
              service.des_due_date = service.des_due_date ? (new Date(service.des_due_date)) : null;
              service.foc_date = service.foc_date ? (new Date(service.foc_date)) : null;
              service.accept_date = service.accept_date ? (new Date(service.accept_date)) : null;
              service.install_date = service.install_date ? (new Date(service.install_date)) : null;

              if (service.inventory) {
                service.inventory.install_date = service.inventory.install_date ? (new Date(service.inventory.install_date)) : null;
                service.inventory.exp_date = service.inventory.exp_date ? (new Date(service.inventory.exp_date)) : null;
                service.inventory.disc_date = service.inventory.disc_date ? (new Date(service.inventory.disc_date)) : null;
                service.inventory.term_date = service.inventory.term_date ? (new Date(service.inventory.term_date)) : null;
                service.inventory.acq_date = service.inventory.acq_date ? (new Date(service.inventory.acq_date)) : null;
                service.inventory.upgrade_date = service.inventory.upgrade_date ? (new Date(service.inventory.upgrade_date)) : null;

                if (service.inventory.inventory_sites) {
                  service.inventory.sites = [];
                  service.inventory.inventory_sites.forEach(function(inventory_site) {
                    service.inventory.sites.push(inventory_site.site);
                  });
                }

              }

            });
          }


            if (instance.requester) {
                instance.requester.full_name = instance.requester.first_name+ ' ' + instance.requester.last_name;
            }

            if (instance.approver) {
                instance.approver.full_name = instance.approver.first_name+ ' ' + instance.approver.last_name;
            }

            if (instance.processor) {
                instance.processor.full_name = instance.processor.first_name+ ' ' + instance.processor.last_name;
            }

        }
      }

      return DS.defineResource({
        name: 'order',
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
