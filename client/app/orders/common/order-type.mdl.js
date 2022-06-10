/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('OrderType', function (Dictionary) {

      var typeKey = 'order-type';

      function OrderType() {

      }

      OrderType.findAll = function () {
        return Dictionary.getDictionary(typeKey);
      };

      return OrderType;

    });

}());
