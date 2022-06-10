/**
 * Created by albin on 2/19/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.customers', {
        url: '/customers',
        views: {
          'main@app' : {
            controller: 'CustomersCtrl as ctx',
            templateUrl: 'app/customers/list/customer-list.html'
          }
        }
      });
    });
}());
