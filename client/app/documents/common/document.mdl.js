(function () {
  'use strict';

  angular.module('lcma')
    .factory('Document', function (DS,HistoryRefresh) {

      return DS.defineResource({
        name: 'document',
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
          entity: {
            method: 'GET'
          }
        }
      });
    });

}());
