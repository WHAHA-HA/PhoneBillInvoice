'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.vendors', {
        url: '/vendors',
        views: {
          "main@app": {
            templateUrl: 'app/vendors/list/vendor-list.html',
            controller: 'VendorsCtrl as ctx'
          }
        }

      });
  });
