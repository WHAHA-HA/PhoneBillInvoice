/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('OrderRejectReason', function (Dictionary) {

      var typeKey = 'order-reject-reason';

      function OrderRejectReason() {

      }

      OrderRejectReason.findAll = function () {
        return Dictionary.getDictionary(typeKey);
      };

      return OrderRejectReason;

    });

}());
