/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('OrderServiceMissedReason', function (Dictionary) {

      var typeKey = 'order-service-missed-reason';

      function OrderServiceMissedReason() {

      }

      OrderServiceMissedReason.findAll = function () {
        return Dictionary.getDictionary(typeKey);
      };

      return OrderServiceMissedReason;

    });

}());
