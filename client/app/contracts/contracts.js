'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.contracts', {
        url: '/contracts',
        views: {
          "main@app": {
            templateUrl: 'app/contracts/list/contract-list.html',
            controller: 'ContractsCtrl as ctx'
          }
        }

      })
      .state('app.contractDetails', {
        url: '/contracts/:id',
        views: {
          "main@app": {
            templateUrl: 'app/contracts/show/contract-show.html',
            controller: 'ContractShowCtrl as ctx'
          }
        }


      });
  });
