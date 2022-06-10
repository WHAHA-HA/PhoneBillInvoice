/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.[MODULE]', {
        url: '/[MODULE]',
        views: {
          'main@app' : {
            controller: 'ModuleCtrl as ctx',
            templateUrl: 'app/module/list/[MODULE]-list.html'
          }
        }
      });

    });

}());
