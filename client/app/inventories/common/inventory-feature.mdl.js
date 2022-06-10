(function () {
  'use strict';

  angular.module('lcma')
    .factory('InventoryFeature', function (DS, HistoryRefresh) {

      return DS.defineResource({
        name: 'inventoryFeature',
        endpoint: 'feature',
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
