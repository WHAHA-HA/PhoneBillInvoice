/**
 * Created by mac on 2/19/16.
 */
/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('CustomerEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentCustomer, Customer) {

      var customer = $scope.customer = angular.copy($currentCustomer);

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Customer.update(customer.id, customer)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
