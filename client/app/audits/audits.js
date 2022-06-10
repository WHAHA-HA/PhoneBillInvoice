'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.audits', {
        url: '/audits',
        views: {
          "main@app": {
            templateUrl: 'app/audits/list/audit-list.html',
            controller: 'AuditsCtrl as ctx'
          }
        }
      })
      .state('app.auditNew', {
        url: '/audits/new',
        views: {
          "main@app": {
            templateUrl: 'app/audits/new/audit-new.html',
            controller: 'AuditNewCtrl as ctx'
          }
        }
      })
      .state('app.auditEdit', {
        url: '/audits/:id',
        resolve: {
          $currentAudit: function ($stateParams, Audit) {
            return Audit.find($stateParams.id);
          }
        },
        views: {
          "main@app": {
            templateUrl: 'app/audits/edit/audit-edit.html',
            controller: 'AuditEditCtrl as ctx'
          }
        }
      })

    ;
  });
