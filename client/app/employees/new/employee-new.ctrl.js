/**
 * Created by bear on 2/29/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('EmployeeNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Employee, AccountStatus) {

      var employee = $scope.employee = {

      };

      $scope.employees = [];

      Employee.findAll().then(function (employee) {
        $scope.employees = employee;
      });

      AccountStatus.findAll().then(function (statuses) {
        $scope.statuses = statuses;
        employee.status = statuses[0].id;
      });

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Employee.create(employee)
          .then(function (result) {
            $uibModalInstance.close(result, true);
          });
      };

      $scope.cancel = function () {
        employee = $scope.employee = {
        };

        $uibModalInstance.dismiss('cancel');
      };
    });
}());
