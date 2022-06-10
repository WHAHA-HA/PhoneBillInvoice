/**
 *
 */
(function () {
  'use strict';

  function AuditNewCtrl($lcmaPage, $state, $scope, $lcmaGrid, $lcmaGridFilter, $filter, $timeout, Audit, Charge, Vendor) {
    $lcmaPage.setTitle('New Audit');

    var _this = this;

    _this.audit = {

    };

    _this.wizardStep =0 ;

    _this.invoiceChargesGridColumns = [{ field: 'name111'}, { field: 'gender111'}];

    var invoiceChargesGrid = _this.invoiceChargesGrid = $lcmaGrid({
        enableFiltering: false,
        enableSorting: true,
        onRegisterApi: function (api) {
          _this.gridApi = api;

          api.core.on.sortChanged($scope, function (grid, columns) {
            _this.chargeQuery.orderBy = columns.map(function (x) {
              return [x.field, x.sort.direction.toUpperCase()];
            });

            _this.query();
          });

          api.core.on.filterChanged($scope, function (x) {

            $lcmaGridFilter(this.invoiceChargesGrid, _this.chargeQuery)
              .applyAll(invoiceChargesGrid.columnDefs.filter(function (x) {
                return x.enableFiltering;
              }));

            _this.query();
          });

          api.selection.on.rowSelectionChanged($scope,function(row){
            var msg = 'row selected ' + row.isSelected;
            console.log(msg);
          });

        },
        columnDefs: _this.invoiceChargesGridColumns

      }).options();

    _this.listNames = {
      "A" : "All Fields",
      "B" : "Selected Fields"
    };

    _this.invoiceChargesFields = {
      selected: null,
      lists: {"A": [
        {
          label: 'acct_level'
        },
        {
          label: 'acct_level_1'
        },
        {
          label: 'acct_level_2'
        },
        {
          label: 'sp_name'
        },
        {
          label: 'subscriber'
        },
        {
          label: 'sp_serv_id'
        },
        {
          label: 'sp_serv_id_type'
        },
        {
          label: 'rel_sp_fac_id'
        },
        {
          label: 'btn'
        },
        {
          label: 'class_of_svc_usoc'
        },
        {
          label: 'chg_code_1'
        },
        {
          label: 'chg_desc_1'
        },
        {
          label: 'chg_code_2'
        },
        {
          label: 'chg_desc_2'
        },
        {
          label: 'chg_code_3'
        },
        {
          label: 'chg_desc_3'
        },
        {
          label: 'charge_category'
        },
        {
          label: 'activity_type'
        },
        {
          label: 'svc_type'
        },
        {
          label: 'svc_sub_type'
        },
        {
          label: 'activity_comp_date'
        },
        {
          label: 'svc_establish_date'
        },
        {
          label: 'beg_chg_date'
        },
        {
          label: 'end_chg_date'
        },
        {
          label: 'chg_qty1_type'
        },
        {
          label: 'chg_qty1_used'
        },
        {
          label: 'chg_qty1_allowed'
        },
        {
          label: 'chg_qty1_billed'
        },
        {
          label: 'chg_qty2_type'
        },
        {
          label: 'chg_qty2_used'
        },
        {
          label: 'chg_rate'
        },
        {
          label: 'chg_amt'
        },
        {
          label: 'chg_basis'
        },
        {
          label: 'disc_pct'
        },
        {
          label: 'prorate_factor'
        },
        {
          label: 'currency'
        },
        {
          label: 'info_only_ind'
        },
        {
          label: 'site_a_id'
        },
        {
          label: 'site_a_addr_1'
        },
        {
          label: 'site_a_addr_2'
        },
        {
          label: 'site_a_addr_3'
        },
        {
          label: 'site_a_addr_4'
        },
        {
          label: 'site_a_addr_city'
        },
        {
          label: 'site_a_addr_st'
        },
        {
          label: 'site_a_addr_st'
        },
        {
          label: 'site_a_addr_cntry'
        },
        {
          label: 'site_a_addr_zip'
        },
        {
          label: 'site_a_npa_nxx'
        },
        {
          label: 'site_z_id'
        },
        {
          label: 'site_z_addr_1'
        },
        {
          label: 'site_z_addr_2'
        },
        {
          label: 'site_z_addr_3'
        },
        {
          label: 'site_z_addr_4'
        },
        {
          label: 'site_z_addr_city'
        },
        {
          label: 'site_z_addr_st'
        },
        {
          label: 'site_z_addr_cntry'
        },
        {
          label: 'site_z_addr_zip'
        },
        {
          label: 'site_z_npa_nxx'
        },
        {
          label: 'fac_bw'
        },
        {
          label: 'fac_bw_unit_type'
        },
        {
          label: 'disc_plan'
        },
        {
          label: 'rate_plan'
        },
        {
          label: 'contract_id'
        },
        {
          label: 'contract_eff_date'
        },
        {
          label: 'contract_end_date'
        },
        {
          label: 'orig_inv_date'
        },
        {
          label: 'cfa'
        },
        {
          label: 'jur'
        },
        {
          label: 'jur_state_or_cntry'
        },
        {
          label: 'tax_jur'
        },
        {
          label: 'sp_so_num'
        },
        {
          label: 'cust_so_num'
        },
        {
          label: 'cust_chg_code'
        },
        {
          label: 'pic'
        },
        {
          label: 'pic_name'
        },
        {
          label: 'lpic'
        },
        {
          label: 'lpic_name'
        },
        {
          label: 'cust_v_coord'
        },
        {
          label: 'cust_h_coord'
        },
        {
          label: 'sp_v_coord'
        },
        {
          label: 'cust_clli'
        },
        {
          label: 'sp_clli'
        },
        {
          label: 'tax_id_num'
        },
        {
          label: 'call_type'
        },
        {
          label: 'prod_type'
        },
        {
          label: 'dir_ind'
        },
        {
          label: 'share_ind'
        },
        {
          label: 'curr_prir_ind'
        },
        {
          label: 'rate_period'
        },
        {
          label: 'roam_ind'
        },
        {
          label: 'band'
        },
        {
          label: 'sp_inv_line_num'
        },
        {
          label: 'sp_inv_record_type'
        },
        {
          label: 'udf'
        }
      ], "B": []}
    };

    _this.availablePrevMonths = [
      {
        label: 'Last 3 months',
        value: 3
      },
      {
        label: 'Last month',
        value: 1
      }
    ];

    $scope.$watch(
      function watchChargeFields(scope) {
        // Return the "result" of the watch expression.
        return(_this.invoiceChargesFields);
      },
      function handleChargeFieldsChange(model) {
        //$scope.modelAsJson = angular.toJson(model, true);
      }, true
    );

    /**
     * Add all buttons
     */
    _this.addAllChargeFields = function() {
      _this.invoiceChargesFields.lists.B = _.concat(_this.invoiceChargesFields.lists.B, _this.invoiceChargesFields.lists.A)
      _this.invoiceChargesFields.lists.A = [];
    };

    /**
     * Delete all buttons
     */
    _this.delAllChargeFields = function() {
      _this.invoiceChargesFields.lists.A = _.concat(_this.invoiceChargesFields.lists.A, _this.invoiceChargesFields.lists.B)
      _this.invoiceChargesFields.lists.B = [];
    };

    /**
     * Update Invoice Charge Data grid
     */
    _this.updateInvoiceChargesGrid = function() {

      _this.invoiceChargesGridColumns.length=0;


      //default column
      _this.invoiceChargesGridColumns.push({field: 'id'});


      _(_this.invoiceChargesFields.lists.B).forEach(function(ele) {
        _this.invoiceChargesGridColumns.push({field: ele.label});
      });

      _this.invoiceChargesGridColumns.push({field: 'chg_qty1_billed'});
      _this.invoiceChargesGridColumns.push({field: 'chg_rate'});
      _this.invoiceChargesGridColumns.push({field: 'chg_amt'});

      _this.wizardStep = 2;

      //update charge data fields columns & rows
      _this.query();

    };

    _this.createAudit = function (form) {

      form.$setSubmitted();

      if (!form.$valid) {
        return;
      }

      Audit.create(_this.audit).then(function (audit) {
        $state.go('app.auditEdit', {id: audit.id});
      })

    };

    _this.cancelAudit = function () {
      $state.go('app.audits');
    };

    _this.chargeQuery = {
      where: {}
    };

    // calculates total charges & total qty of charges
    _this.calc = function() {

      _this.audit.total_charges = _.sumBy(_this.gridApi.selection.getSelectedRows(), function(o) {
        return parseFloat(o.chg_amt)
      });

      _this.audit.total_charges = $filter('currency')(_this.audit.total_charges, '$', 2);

      _this.audit.total_qty = _.sumBy(_this.gridApi.selection.getSelectedRows(), function(o) {
        return parseFloat(o.chg_qty1_billed);
      });
    };

    //init function
    _this.query = function() {

      //specify auditFilter: true to run knex at backend

      // filter by Vendor Name: not id
      var prevMonth = '';

      if (!_this.audit.prevMonth) {
        prevMonth = '';
      }
      else {
        prevMonth = _this.audit.prevMonth.value;
      }

      var fields = ['id', 'chg_qty1_billed' ,'chg_rate', 'chg_amt'];

      if (_this.invoiceChargesFields.lists.B.length > 0) {
        fields = _.concat(fields, _.map(_this.invoiceChargesFields.lists.B, 'label'));
      }

      if (_this.audit.vendor_id) {
        Vendor.find(_this.audit.vendor_id).then(function(vendor) {
          Charge.findAll(
            {
              filter: JSON.stringify(_this.chargeQuery),
              vendor: JSON.stringify(vendor.name),
              prevMonth: JSON.stringify(prevMonth),
              auditFilter: JSON.stringify('true'),
              fields: JSON.stringify(fields)
            }
          ).then(function (charges) {
            invoiceChargesGrid.data = charges;
          });
        });
      }
      else {
        Charge.findAll(
          {
            filter: JSON.stringify(_this.chargeQuery),
            vendor: JSON.stringify(''),
            prevMonth: JSON.stringify(prevMonth),
            auditFilter: JSON.stringify('true'),
            fields: JSON.stringify(fields)
          }
        ).then(function (charges) {
          invoiceChargesGrid.data = charges;
        });
      }

    };



  }

  angular.module('lcma')
    .controller('AuditNewCtrl', AuditNewCtrl)

}());
