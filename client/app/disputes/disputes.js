'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.disputes', {
        url: '/disputes',
        views: {
          "main@app": {
            templateUrl: 'app/disputes/list/dispute-list.html',
            controller: 'DisputesCtrl as ctx'
          }
        }
      })
      .state('app.disputeDetails', {
        url: '/dispute/:id',
        views: {
          "main@app": {
            templateUrl: 'app/disputes/show/dispute-show.html',
            controller: 'DisputeShowCtrl as ctx'
          }
        }
      })
      .state('app.disputeEdit', {
        url: '/dispute/:id/edit',
        resolve: {
          $currentDispute: function ($stateParams, Dispute) {
            return Dispute.find($stateParams.id);
          }
        },
        views: {
          "main@app": {
            templateUrl: 'app/disputes/edit/dispute-edit.html',
            controller: 'DisputeEditCtrl as ctx'
          }
        }
      });
  });
