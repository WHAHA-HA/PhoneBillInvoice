/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('RouteEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Route, $currentInventory, $currentRoute) {

      var route = $scope.route = angular.copy($currentRoute),
        inventory = $scope.inventory = $currentInventory;

      $scope.update = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Route.update(route.id, route, {params: {inventory_id: inventory.id}})
          .then(function (route) {
            $uibModalInstance.close(route);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
