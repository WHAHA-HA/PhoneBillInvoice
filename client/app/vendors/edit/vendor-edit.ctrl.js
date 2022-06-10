/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('VendorEditCtrl', function ($scope, $uibModalInstance, $lcmaDialog, vendor, Vendor, pic, vendors) {

      $scope.vendor = angular.copy(vendor);
      $scope.logo_tmp = pic.logo_tmp;
      $scope.showCropImage = pic.showCropImage;
      $scope.vendors = vendors.filter(function (x) {
        return x.id != vendor.id;
      });

      $scope.onMoveToVendorChange = function (alias, vendor_id, index) {

        if (vendor_id) {
          Vendor.assignAlias(vendor_id, {
              params: {
                alias_id: alias.id
              }
            })
            .then(function () {
              var aliases = $scope.vendor.aliases;
              var current = aliases.filter(function (x) {
                return x.id === alias.id;
              });
              var selectedVendor = $scope.vendors.filter(function (x) {
                return x.id === vendor_id;
              })[0];
              aliases.splice(index, 1);
              if(selectedVendor) {
                selectedVendor.aliases.push(alias);
              }
            })
        }
      };

      $scope.addAlias = function (aliasName) {
        Vendor.addAlias($scope.vendor.id, {
            params: {
              alias: aliasName
            }
          })
          .then(function (response) {
            $scope.vendor.aliases.push(response.data);
            $scope.newAlias = '';
          })
      };

      $scope.removeAlias = function (alias, index) {

        $lcmaDialog.confirm({
            titleText: 'Are you sure?',
            bodyText: 'Are you sure you want to remove ' + alias.alias + " alias?"
          })
          .result
          .then(function () {
            Vendor.removeAlias($scope.vendor.id, {
                params: {
                  alias_id: alias.id
                }
              })
              .then(function (response) {
                $scope.vendor.aliases.splice(index, 1);
              })
          });
      };

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        if ($scope.showCropImage) {
          $scope.vendor.logo = $scope.logo_tmp;
        }

        if ($scope.vendor.logo) {
          Vendor.resizedataURL($scope.vendor.logo, function (dataUrl) {
            $scope.vendor.logo = dataUrl;
            Vendor.update(vendor.id, $scope.vendor).then(function (vendor) {
              $uibModalInstance.close(vendor);
            });
          });
        }
        else {
          Vendor.update(vendor.id, $scope.vendor).then(function (vendor) {
            $uibModalInstance.close(vendor);
          });
        }

      };

      $scope.cancel = function () {
        $scope.showCropImage = false;
        $uibModalInstance.dismiss('cancel');
      };

      $scope.EditPicture = function () {
        $scope.showCropImage = true;
      };

    });


}());
