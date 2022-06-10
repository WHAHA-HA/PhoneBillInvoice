/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.sites', {
        url: '/sites',
        views: {
          'main@app' : {
            controller: 'SitesCtrl as ctx',
            templateUrl: 'app/sites/list/site-list.html'
          }
        }
      });

    });

}());
