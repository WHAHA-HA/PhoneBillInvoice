'use strict';

angular.module('lcma')
  .controller('OrderShowCtrl', function ($scope, $state, $lcmAlert, $lcmaDialog, $stateParams, $lcmaGrid, $lcmaPage,
                                             $uibModal, Order) {

    $lcmaPage.setTitle('Order');

    var _this = this;

    _this.editing = false;


    /**
     * Initiates disable/enable settings
     */
    _this.editOrder = function () {
      _this.editing = !_this.editing;
    };

    // save order
    _this.saveOrder = function (form) {
      if (!form.$valid) {
        return;
      }

      if (_this.order.id) {
        Order.update(_this.order.id, _this.order)
          .then(function (data) {

            _this.editing = false;
            _this.order = data;
          });
      }
      else {
        Order.create(_this.order)
          .then(function (data) {
            console.log(data);
            _this.editing = false;
            _this.order = data;
          });
      }

    };


    /**
     * Activate related items tab
     * @param tab
     */
    _this.activateRelatedTab = function (tab) {
      _this.relatedTabs = {active: tab};
    };

    /**
     * Queries charges against query.
     */
    _this.query = function () {
      if ($stateParams['id']) {
        return Order.find($stateParams['id']).then(function (order) {

          _this.order = order;

          $lcmaPage.setTitle('Order ID: ' + _this.order.id);

        });
      }
      else {
        _this.order = {};
      }
    };

    _this.activateRelatedTab('orders');
    _this.query();

  });
