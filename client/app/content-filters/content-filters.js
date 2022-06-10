/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.content-filter', {
        url: '/content-filters',
        views: {
          'main@app' : {
            controller: 'FilterListCtrl as ctx',
            templateUrl: 'app/content-filters/list/content-filter-list.html'
          }
        }
      });
    });


}());
