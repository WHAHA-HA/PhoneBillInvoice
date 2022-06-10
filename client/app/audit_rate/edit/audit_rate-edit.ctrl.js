/**
 * Created by bear on 2/25/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('AuditRateEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentAuditRate, AuditRate) {

      var auditRate = $scope.auditRate = angular.copy($currentAuditRate);

      var hierarchy = [];

      function collectionHierarchy(item) {

        angular.forEach(item.auditRate, function (x) {
          hierarchy.push(x.id);
          collectionHierarchy(x);
        });
      }

      $scope.auditRates = [];

      AuditRate.findAll().then(function (auditRates) {
        collectionHierarchy($currentAuditRate);

        $scope.auditRates = auditRates.filter(function (x) {
          return x.id != auditRates.id && hierarchy.indexOf(x.id) === -1;
        });
      });

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        AuditRate.update(auditRate.id, auditRate)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
