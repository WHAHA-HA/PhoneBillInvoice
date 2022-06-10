/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('FeaturePlanNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, InventoryPlan, $currentInventory) {

      var plan = $scope.plan = {},
        inventory = $scope.inventory = $currentInventory;

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        InventoryPlan.create(plan, {params: {inventory_id: inventory.id}})
          .then(function (plan) {
            $uibModalInstance.close(plan);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
