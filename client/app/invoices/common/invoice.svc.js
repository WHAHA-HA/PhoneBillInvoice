/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .service('invoiceService', function ($lcmaGrid, $filter, $uibModal, uiGridConstants) {

      function getFilters() {
        return [
            {key: 0, label: 'New', value:0},
            {key: 10, label: 'New (Rejected)', value:10},
            {key: 20, label: 'New (Reset)', value:20},
            {key: 100, label: 'RfA', value: 100},
            {key: 200, label: 'Approved', value:200},
            {key: 300, label: 'GL Coded', value:300}
        ];
      }


      /**
       * Opens new invoice dialog.
       * @param config
       * @returns {*}
       */
      function newInvoiceDialog(config) {

        var defaults = {
          templateUrl: 'app/invoices/new/invoices-new.html',
          controller: 'InvoiceNewCtrl',
          resolve: {}
        };

        var settings = angular.extend({backdrop: 'static'}, defaults, config || {});

        return $uibModal.open(settings).result;
      }

      /**
       * Creates invoice detault grid settings
       * @param config
       * @returns {settings}
       */
      function listGridSettings(config) {

        return $lcmaGrid(config)
          .addColumn('sp_inv_num', 'Invoice Number', {
            width: 170,
            pinnedLeft: true,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="app.invoiceDetails({id: row.entity.id})">{{row.entity.sp_inv_num}}</a></div>',
          })
         .addStatusColumn('header.status_code', 'Status', {
            cellTemplate: '<div class="ui-grid-cell-contents"><lcma-invoice-status-view ng-model="row.entity.header.status_code"></lcma-invoice-status-view></div>',
            filter: {
              term: -1,
              type: uiGridConstants.filter.SELECT,
              selectOptions: getFilters()
            }
          })
          .addColumn('vendor.name', 'Vendor', {
            width: 120,
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.vendor.name}}</div>'
          })
          .addColumn('acct_level_1', 'Account', {
              width: 170,
              cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="app.accountDetails({id: row.entity.id})">{{row.entity.acct_level_1}}</a></div>',
            })
          .addDateColumn('date_issued', 'Invoice Date')
          .addDateColumn('due_date', 'Due Date')
          .addCurrencyColumn('tot_amt_due', 'Total Due')
          .addCurrencyColumn('tot_new_chgs', 'Total New Charges')
          .addColumn('tot_new_chg_chg', 'New Charges Diff')
          .addColumn('tot_new_chg_chg_pct', 'New Charges Diff %')
          .addCurrencyColumn('tot_mrc_chgs', 'Total MRC')
          .addCurrencyColumn('tot_occ_chgs', 'Total OCC')
          .addCurrencyColumn('tot_usage_chgs', 'Usage')
          .addCurrencyColumn('tot_taxusr', 'Total Taxes / Surcharge')
          .addCurrencyColumn('tot_disc_amt', 'Total Discounts')
          .addCurrencyColumn('tot_new_chg_adj', 'Tot Adjs New Chgs')
          .addCurrencyColumn('bal_fwd', 'Balance Forward')
          ;

      }


      /**
       * Sort list of invoices and calculate/update tot_new_chgs & tot_new_chg_chg_pct value
       * for New Charges Diff & New Charges Diff %
       * @param invoices
       */
      function calcNewCharges(invoices) {

        // group the invoices by account number
        var groupedInvoices = _.groupBy(invoices, 'acct_level_1');

        //order subgroup by date_issued && replace
        _.forEach(groupedInvoices, function (subGroup, key) {
          groupedInvoices[key] = _.orderBy(subGroup, ['date_issued'], ['asc']);
        });


        for (var i = 0; i < invoices.length; i++) {

          var record = invoices[i];

          //find previous record from groupedInvoices
          var group = groupedInvoices[record.acct_level_1];

          var index = _.findIndex(group, {id: record.id});

          if (0 < index) {

            var prevRecord = group[index - 1];

            if (prevRecord.date_issued) {
              var prevMonth = prevRecord.date_issued.getUTCMonth() + 1; //months from 1-12
              var prevYear = prevRecord.date_issued.getUTCFullYear();

              var month = record.date_issued.getUTCMonth() + 1; //months from 1-12
              var year = record.date_issued.getUTCFullYear();

              // check previous record is for previous month
              if ((year === prevYear && prevMonth + 1 === month) || (prevYear + 1 === year && 12 === prevMonth && 1 === month )) {
                record.tot_new_chg_chg = record.tot_new_chgs - prevRecord.tot_new_chgs;
                record.tot_new_chg_chg_pct = record.tot_new_chg_chg / record.tot_new_chgs * 100;
                record.tot_new_chg_chg = $filter('currency')(record.tot_new_chg_chg, '$', 2);
                record.tot_new_chg_chg_pct = record.tot_new_chg_chg_pct.toFixed(2) + '%';
              }
              else {
                record.tot_new_chg_chg = 'N/A';
                record.tot_new_chg_chg_pct = 'N/A';
              }
            }
            else {
              record.tot_new_chg_chg = 'N/A';
              record.tot_new_chg_chg_pct = 'N/A';
            }

          }
          else {
            record.tot_new_chg_chg = 'N/A';
            record.tot_new_chg_chg_pct = 'N/A';
          }
        }

        return invoices;
      }

      return {
        listGridSettings: listGridSettings,
        newInvoiceDialog: newInvoiceDialog,
        getFilters: getFilters,
        calcNewCharges: calcNewCharges
      };


    });

}());
