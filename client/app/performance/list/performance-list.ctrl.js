/**
 *
 */
(function () {
    'use strict';

  function PerformanceCtrl($scope, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, $timeout, Performance) {

    $lcmaPage.setTitle('Performance List');


    var _this = this;

    _this.layout = {
      orientation: 'vertical',
      list: {
        size: 25
      },
      details: {
        size: 75
      }
    };

    _this.layoutAction = function (action) {
      _this.layout.list.size = 80;
    };

    _this.onSettingsUpdate = function (settings) {
      lcmaGrid.updateFromSettings(settings, _this.gridApi);
    };
    var lcmaGrid = $lcmaGrid({
      settingKey: 'performance.list.grid',
      exporterCsvFilename: 'performance.csv',
      multiSelect: false,
      noUnselect: true,
      onRegisterApi: function (api) {

          _this.gridApi = api;

          api.core.on.sortChanged($scope, function (grid, columns) {
              _this.performanceQuery.orderBy = columns.map(function (x) {
                  return [x.field, x.sort.direction.toUpperCase()];
              });

              _this.refresh();
          });

          api.core.on.filterChanged($scope, function (x) {

              $lcmaGridFilter(this.grid, _this.performanceQuery)
                  .applyAll(grid.columnDefs.filter(function (x) {
                      return x.enableFiltering;
                  }));

              _this.refresh();

          });


      }

    })

      .addNumberColumn('cpu', 'CPU')
      .addNumberColumn('memory', 'Memory')
      .addNumberColumn('network', 'Network')
      .addDateColumn('performance_date', 'Performance');
      var grid = _this.gridOptions =  lcmaGrid.options();


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.performanceQuery.limit = _this.pager.size;
        _this.performanceQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds buildings query.
     */
    _this.performanceQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1,
      orderBy: [['cpu', 'ASC']]
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
      _this.performanceQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };



    _this.refresh = function () {

      Performance.findAll({filter: JSON.stringify(_this.performanceQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;

          // select first immediately
          if (data.length) {
            //need timeout to make sure grid element actually associated with variable
            $timeout(function() {
              _this.gridApi.selection.selectRow(grid.data[0]);
            });
          }
          else {
            _this.currentSelection = null;
          }

        });

    };




    _this.refresh();

  }

  angular.module('lcma')
    .controller('PerformanceCtrl', PerformanceCtrl);

}());
