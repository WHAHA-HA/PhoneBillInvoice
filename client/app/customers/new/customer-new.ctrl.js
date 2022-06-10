/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('CustomerNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Customer) {

      var customer = $scope.customer = {

      };

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Customer.create(customer)
          .then(function (result) {
            $uibModalInstance.close(result, true);
          });
      };

      $scope.cancel = function () {
        customer = $scope.customer = {

        };

        $uibModalInstance.dismiss('cancel');
      };
    });


}());
