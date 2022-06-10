/**
 * Created by bear on 2/22/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('EquipmentEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentEquipment, Equipment, Site, Vendor, SiteType, Contract) {

      var equipment = $scope.equipment = angular.copy($currentEquipment);

      var hierarchy = [];

      function collectionHierarchy(item) {
        angular.forEach(item.equipment, function (x) {
          hierarchy.push(x.id);
          collectionHierarchy(x);
        });
      }

      $scope.sites = [];
      $scope.vendors = [];
      $scope.equipments = [];
      $scope.types = [];
      $scope.contracts = [];

      Contract.findAll().then(function (contracts) {
        $scope.contracts = contracts;
      });

      Site.findAll().then(function (sites) {
        $scope.sites = sites;
      });

      SiteType.findAll()
        .then(function (items) {
          $scope.types = items;
        });

      Vendor.findAll().then(function (vendors) {
        $scope.vendors = vendors;
      });

      Equipment.findAll().then(function (equipments) {
        collectionHierarchy($currentEquipment);

        $scope.equipments = equipments.filter(function (x) {
          return x.id != equipments.id && hierarchy.indexOf(x.id) === -1;
        });
      });

      $scope.update = function (form) {
          
        if (!form.$valid) {
          return;
        }

        Equipment.update(equipment.id, equipment)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
