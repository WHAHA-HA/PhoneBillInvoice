/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('BuildingNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Building) {

      var building = $scope.building = {

      };

      $scope.buildings = [];

      Building.findAll().then(function (buildings) {
        $scope.buildings = buildings;
      });

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Building.create(building)
          .then(function (result) {
            $uibModalInstance.close(result, true);
          });
      };

      $scope.cancel = function () {
        building = $scope.building = {
        };

        $uibModalInstance.dismiss('cancel');
      };
    });


}());
