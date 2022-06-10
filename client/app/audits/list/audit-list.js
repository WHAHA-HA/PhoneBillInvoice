'use strict';

angular.module('lcma')
  .controller('AuditsCtrl', function ($scope, $state, $location, $lcmAlert, $lcmaDialog, $lcmaPage, $lcmaPager, $lcmaGrid, $lcmaGridFilter, $uibModal, Audit) {

    $lcmaPage.setTitle('Audits');

    var _this = this;

    /**
     * Audits grid definition
     */
    var lcmaGrid = $lcmaGrid({
      exporterCsvFilename: 'audits.csv',
      settingKey: 'audit.list.grid',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.auditQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.auditQuery)
            .apply('audit_id')
            .apply('user.username')
            .apply('created_at', 'date')
            .apply('total_amount', 'currency')
            .apply('calculated_amount', 'currency')
            .apply('auditd_amount', 'currency')
          ;

          _this.refresh();
        });
      }
    })
      .addCommandColumn('edit', ' ', {
        cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.auditEdit({id: row.entity.id})"><i class="fa fa-pencil fa-lg"></i></a>'
      })
      .addColumn('id', "Audit ID")
      .addColumn('name', "Audit Name")
      .addColumn('vendor.name', "Vendor ID")
      .addColumn('invoice_qty', "Invoice Quantity")
      .addColumn('invoice_type.value', "Invoice Type")
      .addCurrencyColumn('invoice_charge', "Invoice Charges")
      .addDateColumn('audit_run_month', "Run Month")
      .addCurrencyColumn('total_charges', "Total Charges")
      .addNumberColumn('total_charges_qty', "Total Charges Quantity")
      .addCurrencyColumn('total_impact', "Impacted Charges")
      .addNumberColumn('total_impact_qty', "Impacted Charges Quantity")
      .addCurrencyColumn('total_calculated_impact', "Total Calculated Charges")
      .addCurrencyColumn('total_dispute_impact', "Total Dispute Amount", {width: 140});
      var grid = _this.gridOptions = lcmaGrid.options();
    
      $scope.onSettingsUpdate = function (settings) {
        lcmaGrid.updateFromSettings(settings, _this.gridApi);
      };

    /**
     * Opens view audit dialog
     */
    $scope.viewAuditDetails = _this.viewAudit = function (id) {

      $state.go('app.auditDetails',  {id:id});

    };


    /**
     * Initiates Audit remove.
     */
    $scope.removeAudit = _this.remove = function () {
        if (_this.gridApi.selection.getSelectedRows().length === 0)
            return;
        var audit = _this.gridApi.selection.getSelectedRows()[0];
        $lcmaDialog.remove({
            message: ' Audit ' + audit.id
        }).result.then(function () {
            Audit.destroy(audit.id);
        });
    };

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.auditQuery.limit = _this.pager.size;
        _this.auditQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });

    /**
     * add audit
     */
    _this.addAudit = function() {
      $state.go('app.auditNew');
    };

    /**
     * Holds invoice query.
     */
    _this.auditQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.auditQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.gridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Refreshes data against query.
     */
    _this.refresh = function () {

      _this.auditQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      return Audit.findAll({filter: JSON.stringify(_this.auditQuery)})
        .then(function (data) {
          var meta = data.length ? data[0].$meta : {total: 0};
          grid.data = data;
          _this.pager.total = meta.total;

          return data;
        });
    };

    _this.refresh();
  });
