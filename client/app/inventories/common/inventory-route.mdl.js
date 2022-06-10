(function () {
  'use strict';

  angular.module('lcma')
    .factory('Route', function (DS, HistoryRefresh) {

      return DS.defineResource({
        name: 'route',
        endpoint: 'route',
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
        relations: {
          belongsTo: {
            inventory: {
              parent: true,
              localKey: 'inventory_id',
              localField: 'inventory'
            }
          }
        }
      });
    });

}());
