/**
 *
 */
(function () {
    'use strict';

  function BuildingPickerDirective(Building, $uibModal) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        model: '=ngModel'
      },
      templateUrl: 'components/building/building.html',
      controller: function ($scope) {
        $scope.selection = null;
        $scope.selection = $scope.model;

        function select(){
          $scope.buildings.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          })
        }

        Building.findAll().then(function (buildings) {
          $scope.buildings = buildings;
        });

        $scope.$watch('selection', function(x){
          $scope.model = x;
        });

        $scope.$watch('model', function(x){
          $scope.selection = $scope.model;
        });

        /**
         * Opens add vendors dialog
         */
        $scope.addItem = function () {
          $uibModal.open({
            templateUrl: 'app/buildings/new/building-new.html',
            controller: 'BuildingNewCtrl',
            windowClass: 'app-modal-window',
            backdrop: 'static'
          }).result.then(function (building) {
            $scope.buildings.push(building);
          });
        };

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaBuildingPicker', BuildingPickerDirective);


}());
