/**
 *
 */
(function () {
    'use strict';

    function CustomerPickerDirective(Customer, $uibModal) {

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                model: '=ngModel'
            },
            templateUrl: 'components/customer/customer.html',
            controller: function ($scope) {


                function select() {
                    $scope.customers.forEach(function (item) {
                        if (item.id == $scope.model) {
                            $scope.selection = item.id;
                        }
                    })
                    $scope.$watch('selection', function (x) {
                        $scope.model = x;
                    });

                    $scope.$watch('model', function (x) {
                        $scope.selection = $scope.model;
                    });
                }

                Customer.findAll().then(function (customers) {
                    $scope.customers = customers;
                    select();
                });



                $scope.clearItem = function () {
                    $scope.selection = null;
                };

                /**
                 * Opens add customers dialog
                 */
                $scope.addItem = function () {
                    $uibModal.open({
                        templateUrl: 'app/customers/new/customer-new.html',
                        controller: 'CustomerNewCtrl',
                        backdrop: 'static',
                        windowClass: 'app-modal-window'
                    }).result.then(function (customer) {
                        $scope.customers.push(customer);
                    });
                };

            }
        };

    }

    angular.module('lcma')
            .directive('lcmaCustomerPicker', CustomerPickerDirective);


}());
