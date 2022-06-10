/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('UnderlyingServiceNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, UnderlyingService, $currentInventory) {

      var service = $scope.service = {},
        inventory = $scope.inventory = $currentInventory;

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        UnderlyingService.create(service, {params: {inventory_id: inventory.id}})
          .then(function (service) {
            $uibModalInstance.close(service);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
