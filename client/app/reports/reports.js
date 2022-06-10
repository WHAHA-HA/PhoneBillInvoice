'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.reports', {
        url: '/reports',
        views: {
          "main@app": {
            templateUrl: 'app/reports/my/my.html',
            controller: 'MyReportsCtrl as ctx'
          }
        }

      });
  });
