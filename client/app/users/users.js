'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.users', {
        url: '/users',
        views: {
          'main@app' : {
            templateUrl: 'app/users/list/user-list.html',
            controller: 'UsersCtrl as ctx'
          }
        }
      });
  });
