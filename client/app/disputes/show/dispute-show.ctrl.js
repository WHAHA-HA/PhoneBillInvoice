/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .controller('DisputeShowCtrl', function ($scope, $stateParams, $lcmaPage, $lcmaGrid, $uibModalInstance, Dispute, disputeId) {

      var _this = $scope.ctx = $scope;


      _this.close = function () {
        $uibModalInstance.dismiss('cancel');
      };

      /**
       * Disputes grid definition
       */
      _this.disputeChargesGrid = $lcmaGrid({
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        enableFiltering: false
      })

        .addColumn('charge.acct_level_1', "Account")
        .addColumn('charge.acct_level_2', "Name")
        .addColumn('charge.chg_class', "Charge Type")
        .addColumn('charge.chg_desc_1', "Charge Desc 1")
        .addColumn('charge.chg_desc_2', "Charge Desc 2")
        .addCurrencyColumn('charge.chg_amt', "Total Amount")
        .addColumn('description', "Dispute description")
        .addCurrencyColumn('disputed_amount', "Disputed Amount")
        .options();

      _this.query = function () {
        Dispute.find(disputeId).then(function (dispute) {
          _this.dispute = dispute;

          _this.disputeChargesGrid.data = dispute.dispute_charges;
        })
      };

      _this.query();

    });

}());
