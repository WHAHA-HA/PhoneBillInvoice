/**
 *
 */
(function () {
  'use strict';

  function EmployeePickerDirective(Employee, $uibModal) {

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        model: '=ngModel'
      },
      templateUrl: 'components/employee/employee.html',
      controller: function ($scope) {
        $scope.selection = null;
        $scope.selection = $scope.model;

        function select(){
          $scope.employees.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          })
        }

        Employee.findAll().then(function (employees) {
          $scope.employees = employees;

          //select();
        });

        $scope.$watch('selection', function(x){
          $scope.model = x;
        });

          $scope.$watch('model', function(x){
              $scope.selection = $scope.model;
          });

        /**
         * Opens add employees dialog
         */
        $scope.addItem = function () {
          $uibModal.open({
            templateUrl: 'app/employees/new/employee-new.html',
            controller: 'EmployeeNewCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window'
          }).result.then(function (employee) {
            $scope.employees.push(employee);
          });
        };

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaEmployeePicker', EmployeePickerDirective);


}());
