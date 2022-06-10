(function () {
    'use strict';

    angular.module('lcma')
    .factory('InventoryDocument', function (DS, HistoryRefresh) {

        function transform(instance) {

            if(instance.id > 0) {
                instance.effective_date = instance.effective_date ? (new Date(instance.effective_date)) : null;
                instance.exp_date = instance.exp_date ? (new Date(instance.exp_date)) : null;
            }

        }


        return DS.defineResource({
            name: 'inventoryDocument',
            endpoint: 'document',
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
