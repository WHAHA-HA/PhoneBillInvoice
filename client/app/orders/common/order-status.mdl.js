/**
 *
 */
(function () {
    'use strict';
   
    angular.module('lcma')
            .factory('OrderStatus', function (Dictionary) {

                var typeKey = 'order-status';
               
                function OrderStatus() {

                }

                OrderStatus.findAll = function () {
                    return Dictionary.getDictionary(typeKey);
                };

                return OrderStatus;

            });
}());
