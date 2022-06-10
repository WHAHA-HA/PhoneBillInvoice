'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.orders', {
        url: '/orders',
        views: {
          "main@app": {
            templateUrl: 'app/orders/list/order-list.html',
            controller: 'OrdersCtrl as ctx'
          }
        }
      })
      .state('app.freshOrders', {
        url: '/freshOrders',
        views: {
          "main@app": {
            templateUrl: 'app/orders/list/order-list.html',
            controller: 'OrdersCtrl as ctx'
          }
        }
      })
      .state('app.orderNew', {
        url: '/orders/new',
        views: {
          "main@app": {
            templateUrl: 'app/orders/new/order-new.html',
            controller: 'OrderNewCtrl as ctx'
          }
        }
      })
      .state('app.orderEdit', {
        url: '/orders/:id/edit',
        views: {
          "main@app": {
            templateUrl: 'app/orders/edit/order-edit.html',
            controller: 'OrderEditCtrl as ctx'
          }
        },
        resolve: {
          $currentOrder: function (Order, $stateParams) {
            var id = $stateParams.id;

            return Order.find(id).then(function (response) {
              return response;
            })

          }
        }
      })
    ;
  });
