/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.permissions', {
        url: '/permissions',
        views: {
          'main@app' : {
            controller: 'PermissionListCtrl as ctx',
            templateUrl: 'app/permissions/list/permissions-list.html'
          }
        }
      });
    });


}());
