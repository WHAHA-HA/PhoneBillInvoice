(function () {
  'use strict';

  angular.module('lcma')
    .factory('ContractSection', function (DS, HistoryRefresh) {

      return DS.defineResource({
        name: 'contractSection',
        endpoint: 'section',
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
            contract: {
              parent: true,
              localKey: 'contract_id',
              localField: 'contract'
            }
          }
        }
      });
    });

}());
