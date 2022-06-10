/**
 * Created by bear on 2/25/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('AuditRateNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, AuditRate) {

      var auditRate = $scope.auditRate = {

      };

      AuditRate.findAll().then(function (auditRates) {
        $scope.auditRates = auditRates;
      });

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        AuditRate.create(auditRate)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
