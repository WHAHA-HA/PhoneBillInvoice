/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.performance', {
        url: '/performance',
        views: {
          'main@app' : {
            controller: 'PerformanceCtrl as ctx',
            templateUrl: 'app/performance/list/performance-list.html'
          }
        }
      });

    });

}());
