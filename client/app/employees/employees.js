/**
 * Created by bear on 2/29/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.employees', {
        url: '/employees',
        views: {
          'main@app' : {
            controller: 'EmployeesCtrl as ctx',
            templateUrl: 'app/employees/list/employee-list.html'
          }
        }
      });
    });
}());
