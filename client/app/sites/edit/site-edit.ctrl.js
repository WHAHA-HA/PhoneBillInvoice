/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('SiteEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentSite, Site, SiteType, Vendor, Building) {

      var site = $scope.site = angular.copy($currentSite);

      var hierarchy = [];

      function collectionHierarchy(item) {

        angular.forEach(item.sites, function (x) {
          hierarchy.push(x.id);
          collectionHierarchy(x);
        });

      }

      $scope.sites = [];

      $scope.types = [];

      SiteType.findAll()
        .then(function (items) {
          $scope.types = items;
        });


      Site.findAll().then(function (sites) {
        collectionHierarchy($currentSite);

        $scope.sites = sites.filter(function (x) {
          return x.id != site.id && hierarchy.indexOf(x.id) === -1;
        });
      });

      Vendor.findAll().then(function (vendors) {
        $scope.vendors = vendors;
      });

      Building.findAll().then(function (buildings) {
        $scope.buildings = buildings;
      });

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Site.update(site.id, site)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
