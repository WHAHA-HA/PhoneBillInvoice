'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.main', {
        url: '/dash',
        views: {
          "main@app": {
            controller: 'MainCtrl',
            templateUrl: 'app/main/main.html'
          }
        }
      });
  });
