/**
 * Created by bear on 2/22/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('EquipmentNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Equipment, Site, Vendor, SiteType, Contract) {

      var equipment = $scope.equipment = {

      };

      $scope.sites = [];
      $scope.vendors = [];
      $scope.equipments = [];
      $scope.types = [];
      $scope.contracts = [];

      Contract.findAll().then(function (contracts) {
        $scope.contracts = contracts;
      });

      SiteType.findAll()
        .then(function (items) {
          $scope.types = items;
        });

      Site.findAll().then(function (sites) {
        $scope.sites = sites;
      });

      Vendor.findAll().then(function (vendors) {
        $scope.vendors = vendors;
      });

      Equipment.findAll().then(function (equipment) {
        $scope.equipments = equipment;
      });

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Equipment.create(equipment)
          .then(function (result) {
            $uibModalInstance.close(result, true);
          });
      };

      $scope.cancel = function () {
        equipment = $scope.equipment = {
        };
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
