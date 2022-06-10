/**
 * Created by bear on 2/25/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.audit_rate', {
        url: '/audit_rate',
        views: {
          'main@app' : {
            controller: 'AuditRateCtrl as ctx',
            templateUrl: 'app/audit_rate/list/audit_rate-list.html'
          }
        }
      });
    });
}());
