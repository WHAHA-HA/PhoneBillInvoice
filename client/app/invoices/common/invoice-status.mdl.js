(function () {
  'use strict';

  angular.module('lcma')
    .factory('InvoiceStatus', function () {

      function InvoiceStatus() {

      }

      InvoiceStatus.findAll = function () {
        return [

          {key: 1, value: 'New'}

        ];
      };

      return InvoiceStatus;
    });

}());
