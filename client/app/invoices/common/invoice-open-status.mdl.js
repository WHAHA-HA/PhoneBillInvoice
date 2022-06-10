(function () {
  'use strict';

  angular.module('lcma')
    .factory('InvoiceOpenStatus', function (Dictionary) {
        
      var typeKey = 'invoice-open-status';

      function InvoiceOpenStatus() {

      }

      InvoiceOpenStatus.findAll = function () {
        return Dictionary.getDictionary(typeKey);
      };

      return InvoiceOpenStatus;
    });

}());