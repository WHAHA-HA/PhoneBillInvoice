/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('SiteNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Site, SiteType) {

      var site = $scope.site = {

      };

      $scope.sites = [];

      $scope.types = [];

      SiteType.findAll()
        .then(function (items) {
          $scope.types = items;
        });

      Site.findAll().then(function (sites) {
        $scope.sites = sites;
      });

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Site.create(site)
          .then(function (result) {
            $uibModalInstance.close(result, true);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        site = $scope.site = {

        };
      };
    });


}());
