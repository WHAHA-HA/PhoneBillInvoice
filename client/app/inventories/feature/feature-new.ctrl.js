/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('FeatureInventoryNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, InventoryFeature, $currentInventory) {

      var feature = $scope.feature = {},
        inventory = $scope.inventory = $currentInventory;

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        InventoryFeature.create(feature, {params: {inventory_id: inventory.id}})
          .then(function (feature) {
            $uibModalInstance.close(feature);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
