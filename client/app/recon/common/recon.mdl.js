(function () {
  'use strict';

  angular.module('lcma')
    .factory('Recon', function (DS, HistoryRefresh) {

      return DS.defineResource({
        name: 'recon',
        actions: {
          invoices: {
            method: 'GET'
          },
          inventories: {
            method: 'GET'
          }
        }
      });
    });

}());
