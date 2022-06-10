(function () {
  'use strict';


  function OrderTypeFilter(OrderType, ArrayUtil) {
    var cache = {},
      types;

    function getValue(key) {

      if (cache[key]) {
        return cache[key];
      }

      cache[key] = "...";

      if (!types) {
        OrderType.findAll().then(function (list) {
          types = list;
          var item = ArrayUtil.find(types, {key: key});
          cache[key] = item ? item.value : "N/A";
        });
      }
      else {
        var item = ArrayUtil.find(types, {key: key});
        cache[key] = item ? item.value : "N/A";
      }

    }

    getValue.$stateful = true;

    return getValue;
  }

  function OrderStatusFilter(OrderStatus, ArrayUtil) {
    var cache = {},
      statuses;

    function getValue(key) {

      if (!key) {
        return "N/A";
      }

      key = key.toString();

      if (cache[key]) {
        return cache[key];
      }

      cache[key] = "...";

      if (!statuses) {
            OrderStatus.findAll().then(function (list) {
                statuses = list;
                var item = ArrayUtil.find(statuses, {custom_key: key});
                cache[key] = item ? item.value : "N/A";        
            });
      }
      else {
        var item = ArrayUtil.find(statuses, {key: key});
        cache[key] = item ? item.value : "N/A";
      }

    }

    getValue.$stateful = true;

    return getValue;
  }

  function OrderPickerDirective(Order) {

    return {
      restrict: 'EA',
      replace: true,
      require: ['ngModel'],
      template: '<select class="form-control" ng-options="order.id as order.id for order in orders"></select>',
      controller: function ($scope) {

        Order.findAll().then(function (orders) {
          $scope.orders = orders;
        });
      }
    };

  }

  angular.module('lcma')
    .filter('lcmaOrderType', OrderTypeFilter)
    .filter('lcmaOrderStatus', OrderStatusFilter)
    .directive('lcmaOrderPicker', OrderPickerDirective);
  ;

}());
