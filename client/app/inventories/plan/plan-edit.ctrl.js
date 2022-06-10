/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('FeaturePlanEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, InventoryPlan, $currentInventory, $currentPlan) {

      var plan = $scope.plan = angular.copy($currentPlan),
        inventory = $scope.inventory = $currentInventory;

      if (plan.monthly_cost) {
        plan.monthly_cost = Number(plan.monthly_cost);
      }

      $scope.update = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        InventoryPlan.update(plan.id, plan, {params: {inventory_id: inventory.id}})
          .then(function (plan) {
            $uibModalInstance.close(plan);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
