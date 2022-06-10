/**
 *
 */
(function () {
    'use strict';

  function ContractPickerDirective(Contract, $uibModal) {

    return {
      restrict: 'EA',
      replace:true,
      scope: {
        model: '=ngModel'
      },
      templateUrl: 'components/contract/contract.html',
      controller: function ($scope) {
        $scope.selection = null;
        $scope.selection = $scope.model;

        function select(){
          $scope.contracts.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          })
        }

        Contract.findAll().then(function (contracts) {
          $scope.contracts = contracts;
        });

        $scope.$watch('selection', function(x){
          $scope.model = x;
        });

        $scope.$watch('model', function(x){
          $scope.selection = $scope.model;
        });

        /**
         * Opens add contract dialog
         */
        $scope.addItem = function () {
          $uibModal.open({
            templateUrl: 'app/contracts/new/contract-new.html',
            backdrop: 'static',
            controller: 'ContractNewCtrl',
	          size:"lg"
          }).result.then(function (contract) {
            $scope.buildings.push(contract);
          });
        };

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaContractPicker', ContractPickerDirective);


}());
