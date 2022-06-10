/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContractSectionNewCtrl', function ($scope, $uibModalInstance, ContractSection, $currentContract) {

      var section = $scope.section = {},
        contract = $scope.contract = $currentContract;


      $scope.create = function (form) {

        if (!form.$valid) {
          return;
        }

        ContractSection.create(section, {params: {contract_id: contract.id}})
          .then(function (section) {
            $uibModalInstance.close(section);
          });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
