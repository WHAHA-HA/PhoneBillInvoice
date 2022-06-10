/**
 * Created by bear on 2/29/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('EmployeeEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentEmployee, Employee, AccountStatus) {

      var employee = $scope.employee = angular.copy($currentEmployee);

      AccountStatus.findAll().then(function (statuses) {
        $scope.statuses = statuses;
        //employee.status = statuses[0].id;
      });

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Employee.update(employee.id, employee)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
