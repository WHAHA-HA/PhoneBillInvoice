/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Inventory', function (DS, HistoryRefresh) {

      function transform(instance) {

        if(instance.id > 0) {
          instance.disc_date = instance.disc_date ? (new Date(instance.disc_date)) : null;
          instance.install_date = instance.install_date ? (new Date(instance.install_date)) : null;
          instance.exp_date = instance.exp_date ? (new Date(instance.exp_date)) : null;
          instance.acq_date = instance.acq_date ? (new Date(instance.acq_date)) : null;
          instance.upgrade_date = instance.upgrade_date ? (new Date(instance.upgrade_date)) : null;
          instance.term_date = instance.term_date ? (new Date(instance.term_date)) : null;
        }

      }

      return DS.defineResource({
        name: 'inventory',
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
        actions: {
            sites: {
                method: 'GET'
            },
            documents: {
                method: 'GET'
            }
        },
        relations: {
          hasMany: {
            sites: {
              localField: 'inventory_site',
              foreignKey: 'inventory_id'
            }
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
