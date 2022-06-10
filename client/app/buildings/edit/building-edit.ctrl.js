/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
        .controller('BuildingEditCtrl', function ($scope, $uibModalInstance, $currentBuilding, Building) {

            var building = $scope.building = angular.copy($currentBuilding);

            $scope.update = function (form) {

                if (!form.$valid) {
                  return;
                }

                Building.update(building.id, building)
                .then(function (result) {
                    $uibModalInstance.close(result);
                });
            };

            $scope.cancel = function (form) {
                $uibModalInstance.dismiss('cancel');
            };


        });


}());
