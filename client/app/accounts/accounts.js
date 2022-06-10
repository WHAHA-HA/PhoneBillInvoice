'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.accounts', {
        url: '/accounts',
        views: {
          "main@app": {
            templateUrl: 'app/accounts/list/account-list.html',
            controller: 'AccountsCtrl as ctx'            
          }
        },
        data: {showAdd:false}
      })
     .state('app.accountsAdmin', {
        url: '/accounts_admin',
        views: {
          "main@app": {
            templateUrl: 'app/accounts/list/account-list.html',
            controller: 'AccountsCtrl as ctx'
          }
        },
        data: {showAdd:true}
      })
      .state('app.accountDetails', {
        url: '/accounts/:id',
        views: {
          "main@app": {
            templateUrl: 'app/accounts/show/account-show.html',
            controller: 'AccountShowCtrl as ctx'
          }
        }
      });
  });
