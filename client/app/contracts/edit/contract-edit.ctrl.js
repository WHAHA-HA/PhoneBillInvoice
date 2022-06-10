/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContractEditCtrl', function ($scope, $uibModalInstance, $timeout, $currentContract , Contract, Vendor) {

      var contract = $scope.contract = angular.copy($currentContract);

      var hierarchy = [];

      function collectionHierarchy(item) {

        angular.forEach(item.children, function (x) {
          hierarchy.push(x.id);
          collectionHierarchy(x);
        });

      }

      Contract.findAll().then(function (data) {

        collectionHierarchy($currentContract);

        $scope.contracts = data.filter(function (x) {
          return x.id != contract.id && hierarchy.indexOf(x.id) === -1;
        });
      });

      Vendor.findAll().then(function (data) {
        $scope.vendors = data;
      });

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        delete contract.expanded;
        delete contract.children;
        delete contract.level;
        delete contract.uid;

        Contract.update(contract.id, contract).then(function (data) {
          $uibModalInstance.close(data);
        });

      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
