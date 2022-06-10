(function () {
    'use strict';

    angular.module('lcma')
            .factory('InventoryGlStrings', function (DS, HistoryRefresh) {

                return DS.defineResource({
                    name: 'inventory_gl_string',
                    afterUpdate: function (resource, data, cb) {
                        HistoryRefresh.refresh();
                        if (cb) {
                            cb(null, data);
                        }
                    },
                    afterCreate: function (resource, data, cb) {
                        HistoryRefresh.refresh();
                        if (cb) {
                            cb(null, data);
                        }
                    },
                    afterDestroy: function (resource, data, cb) {
                        HistoryRefresh.refresh();
                        if (cb) {
                            cb(null, data);
                        }
                    },
                     actions: {
                        save: {
                          method: 'POST'
                        }
                      }
                });
            });

}());
