/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .service('ChargeBrowserService', function ($lcmaGrid, $filter, $uibModal, uiGridConstants, InvoiceChargeStatus) {


      function getFilters() {
        return [
          {value: 0, label: 'Quarantined'},
          {value: 1, label: 'New'},
          {value: 2, label: 'Ready for Approval'},
          {value: 3, label: 'Approved'},
          {value: 4, label: 'GL Coded'}
        ];
      }

      function getInfoIndicatorValues() {
        return [
          {value: 'Y', label: 'Y'},
          {value: 'N', label: 'N'}
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
          .addColumn('sp_name', 'Vendor')
          .addColumn('acct_level_1', 'Account', {width: 170})
          .addColumn('sp_inv_num', 'Invoice Number', {
            width: 170,
            cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.invoiceDetails({id: row.entity.id})">{{row.entity.sp_inv_num}}</a>',
          })
          .addStatusColumn('inv_status', 'Invoice Status', {
            cellTemplate: '<div class="ui-grid-cell-contents"><lcma-invoice-status-view ng-model="row.entity.sp_acct_status_ind"></lcma-invoice-status-view></div>',
            filter: {
              term: -1,
              type: uiGridConstants.filter.SELECT,
              selectOptions: getFilters()
            }
          })
          .addDateColumn('inv_date', 'Invoice Date')
          .addColumn('acct_level_2', "Subaccount")
          .addRelColumn('chg_class', "Charge Type", {
            filter: {
              term: -1,
              type: uiGridConstants.filter.SELECT,
              selectOptions: InvoiceChargeStatus.findAll(),
              map: function (x) {
                return {value: x.custom_key, label: x.value};
              }
            }
          })
          .addColumn('sp_serv_id', "Service ID")
          .addColumn('chg_code_1', "Charge Code1")
          .addColumn('chg_desc_1', "Charge Description 1")
          .addColumn('chg_code_2', "Charge Code2")
          .addColumn('chg_desc_2', "Charge Description 2")
          .addNumberColumn('chg_qty1_billed', "Chg Qty")
          .addNumberColumn('chg_rate', "Charge Rate")
          .addCurrencyColumn('chg_amt', "Charge Amount")
          .addDateColumn('svc_establish_date', "Install Date")
          .addDateColumn('beg_chg_date', "Beg Charge Date")
          .addDateColumn('end_chg_date', "End Charge Date")
          .addRelColumn('info_only_ind', "Info Only Ind", {
            filter: {
              term: -1,
              type: uiGridConstants.filter.SELECT,
              selectOptions: getInfoIndicatorValues()
            }
          })
          .addColumn('fac_bw', "Facility Bandwidth")
          .addColumn('call_type', "Call Type")
          .addColumn('product_type', "Product Type")
          .addColumn('dir_ind', "Dir Ind")
          .addColumn('jur', "Jurisdiction")
          .addColumn('chg_qty1_type', "Chg Qty Type")
          .addNumberColumn('chg_qty1_used', "Chg Qty Used")
          .addColumn('chg_qty1_allowed', "Chg Qty Allowed")
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
