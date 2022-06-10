/**
 *
 */
(function () {
    'use strict';

  function InventoriesCtrl($scope, $state, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, Inventory, uiGridConstants, Dictionary, Vendor, Site) {

    $lcmaPage.setTitle('Inventory List');

    var _this = this;

    _this.inventoryTypes = [];
    
    $scope.onSettingsUpdate = function (settings) {
        lcmaGrid.updateFromSettings(settings, _this.gridApi);
      };

    var lcmaGrid = $lcmaGrid({
      settingKey: 'inventory.list.grid',
      exporterCsvFilename: 'inventories.csv',
      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.inventoryQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.inventoryQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });
      }

    })
    .addColumn('unique_id', 'ID', {
                cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="app.inventoryEdit({id: row.entity.id, type: row.entity.type.custom_key})">{{row.entity.unique_id}}</a></div>'
            })
    .addRelColumn('type_id', "Type", {
      cellFilter: 'lcmaInventoryType',
      cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.type.value}}</div>',
      filter: {
        term: -1,
        type: uiGridConstants.filter.SELECT,
        selectOptions: Dictionary.getDictionary('inventory-type'),
        map: function (x) {
            _this.inventoryTypes.push(x);
            return {value: x.id , label: x.value};
          }
      }
    })
    .addRelColumn('vendor_id', "Vendor", {
      cellFilter: 'lcmaInventoryVendor',
      filter: {
        term: -1,
        nulls : true,
        type: uiGridConstants.filter.SELECT,
        selectOptions: Vendor.findAll(),
        map: function(o){
            return {value:o.id, label:o.name};
        }
      }
    })
    .addColumn('internal_id', 'Internal ID')
    .addDateColumn('install_date', 'Install Date')
    .addRelColumn('site_a_id', 'Site A', {
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.siteA.site_id}}</div>',
        filter: {
          term: -1,
          nulls : true,
          type: uiGridConstants.filter.SELECT,
          selectOptions: Site.findAll(),
          map: function(x){
              return {value: x.id, label: x.site_id};
          }
        }
    })
    .addRelColumn('site_z_id', 'Site Z', {
        cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.siteZ.site_id}}</div>',
        filter: {
          term: -1,
          nulls : true,
          type: uiGridConstants.filter.SELECT,
          selectOptions: Site.findAll(),
          map: function(x){
              return {value: x.id, label: x.site_id};
          }
        }
    });
    var grid = _this.gridOptions = lcmaGrid.options();

    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.inventoryQuery.limit = _this.pager.size;
        _this.inventoryQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds sites query.
     */
    _this.inventoryQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1,
      orderBy: [['vendor_id', 'ASC'], ['type_id', 'ASC'], ['id', 'ASC']]
    };

    /**
     * Go to edit page with empty object: new action
     */
    _this.addInventory = function (type) {
      $state.go('app.inventoryNew', {type: type});
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
      _this.inventoryQuery.where = {};
      _this.gridApi.core.clearAllFilters(true, true, true);
      _this.refresh();
    };


    _this.refresh = function () {
      Inventory.findAll({filter: JSON.stringify(_this.inventoryQuery)}, {bypassCache: true})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });
    };



    _this.refresh();

  }

  angular.module('lcma')
    .controller('InventoriesCtrl', InventoriesCtrl);


}());
