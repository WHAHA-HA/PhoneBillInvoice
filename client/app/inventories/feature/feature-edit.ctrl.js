/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('FeatureInventoryEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, InventoryFeature, $currentInventory, $currentFeature) {

      var feature = $scope.feature = angular.copy($currentFeature),
        inventory = $scope.inventory = $currentInventory;

      $scope.update = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        InventoryFeature.update(feature.id, feature, {params: {inventory_id: inventory.id}})
          .then(function (feature) {
            $uibModalInstance.close(feature);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
