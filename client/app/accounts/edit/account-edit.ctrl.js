/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('AccountEditCtrl', function ($scope, $uibModalInstance, account, Account, AccountStatus) {

    $scope.account = angular.copy(account);


      AccountStatus.findAll().then(function (statuses) {
        $scope.statuses = statuses;
      });

      $scope.update = function (form) {

        if(!form.$valid) {
          return;
        }

        Account.update(account.id, $scope.account).then(function (acc) {
          $uibModalInstance.close(acc);
        });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
