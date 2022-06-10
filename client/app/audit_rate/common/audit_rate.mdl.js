/**
 * Created by bear on 2/25/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('AuditRate', function (DS) {
      return DS.defineResource({
        name: 'audit_rate'
      });
    });

}());
