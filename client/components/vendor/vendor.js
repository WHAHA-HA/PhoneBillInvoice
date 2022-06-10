/**
 *
 */
(function () {
    'use strict';
    function VendorPickerDirective(Vendor, $uibModal) {

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                model: '=ngModel',
                multiple: '@multiple',
                required: '=?required'
            },
            templateUrl: 'components/vendor/vendor.html',
            controller: function ($scope) {

                function select() {
                    $scope.vendors.forEach(function (item) {
                        if (item.id == $scope.model) {
                            $scope.selection = item.id;
                        }
                    });
                    $scope.$watch('selection', function (x) {
                        $scope.model = x;
                    });
                    $scope.$watch('model', function (x) {
                        $scope.selection = $scope.model;
                    });
                }

                Vendor.findAll().then(function (vendors) {
                    $scope.vendors = vendors;
                    select()
                });
                /**
                 * check all
                 */
                $scope.checkAll = function () {
                    $scope.selection = _.map($scope.vendors, 'id');
                };
                /**
                 * clear all
                 */
                $scope.clearAll = function () {
                    if ($scope.multiple) {
                        $scope.selection = [];
                    } else {
                        $scope.selection = null;
                    }

                };
                $scope.clearItem = function () {

                    if ($scope.multiple) {
                        $scope.selection = [];
                    } else {
                        $scope.selection = null;
                    }

                };
                /**
                 * Opens add vendors dialog
                 */
                $scope.addItem = function () {
                    $uibModal.open({
                        templateUrl: 'app/vendors/new/vendor-new.html',
                        controller: 'VendorNewCtrl',
                        backdrop: 'static',
                        size: "sm"
                    }).result.then(function (vendor) {
                        $scope.vendors.push(vendor);
                    });
                };
            }

        };
    }

    angular.module('lcma')
            .directive('lcmaVendorPicker', VendorPickerDirective);
}());
