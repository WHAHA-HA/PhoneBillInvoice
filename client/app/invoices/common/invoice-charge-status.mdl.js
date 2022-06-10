(function () {
  'use strict';

  angular.module('lcma')
    .factory('InvoiceChargeStatus', function (Dictionary) {
        
      var typeKey = 'invoice-charge-status';

      function InvoiceChargeStatus() {

      }

      InvoiceChargeStatus.findAll = function () {
        return Dictionary.getDictionary(typeKey);
      };

      return InvoiceChargeStatus;
    });

}());
