/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('RouteNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Route, $currentInventory) {

      var route = $scope.route = {},
        inventory = $scope.inventory = $currentInventory;

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Route.create(route, {params: {inventory_id: inventory.id}})
          .then(function (route) {
            $uibModalInstance.close(route);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
