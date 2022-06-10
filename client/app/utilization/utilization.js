/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.utilization', {
        url: '/utilization',
        views: {
          'main@app' : {
            controller: 'UtilizationCtrl as ctx',
            templateUrl: 'app/utilization/list/utilization-list.html'
          }
        }
      });

    });

}());
