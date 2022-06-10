(function () {
  'use strict';

  angular.module('lcma')
    .factory('Dispute', function (DS, HistoryRefresh) {

      return DS.defineResource({
        name: 'dispute',
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
            charges_disputed:{
                method: 'GET'
            }
        }
      });
    });

}());
