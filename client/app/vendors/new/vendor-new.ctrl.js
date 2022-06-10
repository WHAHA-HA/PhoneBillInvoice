/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('VendorNewCtrl', function ($scope, $uibModalInstance, Vendor) {

      var vendor = $scope.vendor = {};

      $scope.logo_tmp = ''

      $scope.create = function (form) {

        form.$setSubmitted();

        if(!form.$valid) {
          return;
        }

        if ($scope.showCropImage) {
          $scope.vendor.logo = $scope.logo_tmp;
        }

        if ($scope.vendor.logo) {
          Vendor.resizedataURL($scope.vendor.logo, function(dataUrl) {
            $scope.vendor.logo = dataUrl;

            Vendor.create({
              name: vendor.name,
              code: vendor.code,
              logo: $scope.vendor.logo
            }).then(function (vendor) {
              $uibModalInstance.close(vendor, true);
            });

          });
        }
        else {

          Vendor.create({
            name: vendor.name,
            code: vendor.code,
          }).then(function (vendor) {
            $uibModalInstance.close(vendor, true);
          });
        }

      };

      $scope.EditPicture = function() {
        $scope.showCropImage = true;
      };

      $scope.cancel = function () {
        $scope.vendor = {};
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
