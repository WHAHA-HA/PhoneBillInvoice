'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.roles', {
        url: '/roles',
        views: {
          'main@app' : {
            templateUrl: 'app/roles/list/role-list.html',
            controller: 'RolesCtrl as ctx'
          }
        }
      });
  });
