/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.buildings', {
        url: '/buildings',
        views: {
          'main@app' : {
            controller: 'BuildingsCtrl as ctx',
            templateUrl: 'app/buildings/list/building-list.html'
          }
        }
      });

    });

}());
