/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('AccountNewCtrl', function ($scope, $uibModalInstance, Account, AccountStatus) {

      var account = $scope.account = {

      };

      AccountStatus.findAll().then(function (statuses) {
        $scope.statuses = statuses;
        account.status_id = statuses[0].id;
      });

      $scope.create = function (form) {
        form.$setSubmitted();
        if (!form.$valid) {
          return;
        }

        Account.create(account).then(function (account) {
          $uibModalInstance.close(account);
        });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
