/**
 *
 */
(function () {
  'use strict';

  function OrderNewCtrl($lcmaPage, $me, $state, Order) {
    $lcmaPage.setTitle('New Order');

    var _this = this;
    
    _this.order = {
      status_id: 2,
      created_at : new Date(),
      processor_id: $me.id
    };
    this.createOrder = function (form) {

      form.$setSubmitted();

      if (!form.$valid) {
        return;
      }

      Order.create(_this.order).then(function (order) {
        $state.go('app.orderEdit', {id: order.id});
      })

    };

    _this.cancelOrder = function () {
      $state.go('app.orders');
    };


  }

  angular.module('lcma')
    .controller('OrderNewCtrl', OrderNewCtrl)

}());
