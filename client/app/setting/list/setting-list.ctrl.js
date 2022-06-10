/**
 *
 */
(function () {
    'use strict';

  function SettingCtrl($scope, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, Building) {

    $lcmaPage.setTitle('Setting List');


    var _this = this;

    var grid = _this.gridOptions = $lcmaGrid({

      exporterCsvFilename: 'buildings.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.buildingQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.buildingQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });
      }

    })
      .addCommandColumn('edit', ' ', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editBuilding(row.entity)"><i class="fa fa-pencil"></i></a>',
      })
      .addCommandColumn('remove', '', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeBuilding(row.entity, $index)"><i class="fa fa-trash"></i></a>',
      })
      .addNumberColumn('id', 'Building #')
      .addColumn('name', 'Building Name')
      .addColumn('addr_1', 'Address')
      .addColumn('addr_city', 'City')
      .addColumn('addr_state', 'State')
      .options();

    /**
     * Initiates Building remove.
     */
    $scope.removeBuilding = _this.removeBuilding = function (building, index) {
      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this building?'
      }).result.then(function () {
        //grid.data.splice(index, 1);
        Building.destroy(building.id);
      });
    };

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.buildingQuery.limit = _this.pager.size;
        _this.buildingQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds buildings query.
     */
    _this.buildingQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };

    /**
     * Opens add site dialog
     */
    _this.addBuilding = function () {

      $uibModal.open({
        templateUrl: 'app/buildings/new/building-new.html',
        controller: 'BuildingNewCtrl',
        windowClass: 'app-modal-window',
        backdrop: 'static'
      }).result.then(function (building) {
        grid.data.push(building);
        $lcmAlert.success('New building has been created.');
      });

    };

    /**
     * Opens update building dialog
     */
    $scope.editBuilding = _this.editBuilding = function (building) {

      $uibModal.open({
        templateUrl: 'app/buildings/edit/building-edit.html',
        controller: 'BuildingEditCtrl',
        windowClass: 'app-modal-window',
        backdrop: 'static',
        resolve: {
          $currentBuilding: function () {
            return building;
          }
        }
      }).result.then(function (data) {
        angular.extend(building, data);
        $lcmAlert.success('Building info has been updated.');
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
      _this.buildingQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };



    _this.refresh = function () {

      Building.findAll({filter: JSON.stringify(_this.buildingQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });

    };

    _this.refresh();

  }

  angular.module('lcma')
    .controller('SettingCtrl', SettingCtrl);

}());
