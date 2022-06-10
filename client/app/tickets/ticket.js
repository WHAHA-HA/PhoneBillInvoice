/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.tickets', {
        url: '/tickets',
        views: {
          'main@app' : {
            controller: 'TicketsCtrl as ctx',
            templateUrl: 'app/tickets/list/ticket-list.html'
          }
        }
      });

    });

}());
