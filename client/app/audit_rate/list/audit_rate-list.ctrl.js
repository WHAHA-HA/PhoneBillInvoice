/**
 * Created by bear on 2/25/16.
 */
(function () {
  'use strict';

  function AuditRateCtrl($scope, $lcmaGrid, $lcmAlert, $lcmaDialog, $lcmaGridFilter, $uibModal, $lcmaPager, $lcmaPage, AuditRate) {

    $lcmaPage.setTitle('Audit Rate');


    var _this = this;

    var grid = _this.gridOptions = $lcmaGrid({

      exporterCsvFilename: 'audit_rate.csv',
      onRegisterApi: function (api) {
        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.audit_rateQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });
          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {
          $lcmaGridFilter(this.grid, _this.audit_rateQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));
          _this.refresh();
        });
      }
    })
      .addCommandColumn('edit', ' ', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editAuditRate(row.entity)"><i class="fa fa-pencil"></i></a>'
      })
      .addColumn('id', 'Audit Rate #')
      .addColumn('name', 'Audit')
      .addColumn('chg_class', 'CHG_CLASS')
      .addColumn('chg_description1', 'CHG_DESCRIPTION')
      .addColumn('chg_description2', 'CHG_DESCRIPTION2')
      .addColumn('fac_bw_kb', 'FAC_BW_KB')
      .addCurrencyColumn('rate', 'RATE')
      .options();

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.audit_rateQuery.limit = _this.pager.size;
        _this.audit_rateQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds audit rate query.
     */
    _this.audit_rateQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Opens add Audit Rate Table dialog
     */
    _this.addAuditRate = function () {
      $uibModal.open({
        templateUrl: 'app/audit_rate/new/audit_rate-new.html',
        controller: 'AuditRateNewCtrl',
        windowClass: 'app-modal-window',
        backdrop: 'static'
      }).result.then(function (audit_rate) {
          grid.data.push(audit_rate);
          $lcmAlert.success('New Audit Rate Table has been created.');
        });
    };

    /**
     * Opens edit audit rate table dialog
     */
    $scope.editAuditRate = _this.editAuditRate = function (audit_rate) {
      $uibModal.open({
        templateUrl: 'app/audit_rate/edit/audit_rate-edit.html',
        controller: 'AuditRateEditCtrl',
        windowClass: 'app-modal-window',
        backdrop: 'static',
        resolve: {
          $currentAuditRate: function () {
            return audit_rate;
          }
        }
      }).result.then(function (data) {
          angular.extend(audit_rate, data);
          $lcmAlert.success('Audit Rate Table info has been updated.');
        });
    };

    /**
     * Initiates Audit Rate Table remove.
     */
     $scope.removeAuditRate = _this.remove = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;
            var audit_rate = _this.gridApi.selection.getSelectedRows()[0];
            $lcmaDialog.remove({
                message: ' Audit Rate Table ' + audit_rate.name
            }).result.then(function () {
                AuditRate.destroy(audit_rate.id);
        });
    };

    /**
     * Initiates export to CSV action.
     */
    _this.exportToCSV = function () {

      var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
      _this.gridApi.exporter.csvExport('all', 'all', myElement);

    };

    /**
     * Clears all filters.
     */
    _this.clearFilters = function () {
      _this.audit_rateQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };

    _this.refresh = function () {
      AuditRate.findAll({filter: JSON.stringify(_this.audit_rateQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });
    };

    _this.refresh();
  }

  angular.module('lcma')
    .controller('AuditRateCtrl', AuditRateCtrl);
}());
