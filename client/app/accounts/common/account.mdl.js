(function () {
  'use strict';

  angular.module('lcma')
    .factory('Account', function (DS, HistoryRefresh) {

      return DS.defineResource({
        name: 'account',
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
          updateStatus: {
            method: 'PUT'
          }
        }
      });
    });

}());
