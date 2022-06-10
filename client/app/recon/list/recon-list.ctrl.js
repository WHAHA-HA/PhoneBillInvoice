/**
 *
 */
(function () {
    'use strict';

    function ReconCtrl($scope, $state, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, Inventory, uiGridConstants, Dictionary, Vendor, Recon) {

        $lcmaPage.setTitle('Inventory Reconciliation');

        var _this = this;
        _this.options = {
            minMode: 'month',
            datepickerMode: 'month'
        };

        _this.month = new Date();
        _this.inventoryTypes = [];
        Dictionary.getDictionary('inventory-type').then(function (data) {
            _this.inventoryTypes = data;
        });

        /**
         * Activate related items tab
         * @param tab
         */
        _this.activateRelatedTab = function (tab) {
            _this.relatedTabs = {active: tab};
        };

        _this.activateRelatedTab('unlinked_inventories');

        //unlinked inventory grid
        var inventoriesGrid = _this.inventoriesGridOptions = $lcmaGrid({
            enableRowHeaderSelection: true,
            exporterCsvFilename: 'unlinked-inventory.csv',
            enableFiltering: false,
            multiSelect: false,
            onRegisterApi: function (api) {
                _this.inventoryGridApi = api;
            }

        })
                .addColumn('sp_serv_id', 'Svc Prov ID')
                .addRelColumn('vendor_id', "Vendor", {
                    cellFilter: 'lcmaInventoryVendor',
                    filter: {
                        term: -1,
                        nulls: true,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: Vendor.findAll(),
                        map: function (o) {
                            return {value: o.id, label: o.name};
                        }
                    }
                })
                .addColumn('acct_level_1', 'BAN')
                .options();

        //accruals grid

        var accrualsGrid = _this.accrualsGridOptions = $lcmaGrid({
            enableRowHeaderSelection: true,
            enableFiltering: false,
            exporterCsvFilename: 'accurals.csv',
            multiSelect: false,
            onRegisterApi: function (api) {
                _this.accrualsGridApi = api;
            }

        })
                .addColumn('unique_id', 'ID', {
                    cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="app.inventoryEdit({id: row.entity.id, type: row.entity.type.custom_key})">{{row.entity.unique_id}}</a></div>'
                })
                .addRelColumn('vendor_id', "Vendor", {
                    cellFilter: 'lcmaInventoryVendor',
                    filter: {
                        term: -1,
                        nulls: true,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: Vendor.findAll(),
                        map: function (o) {
                            return {value: o.id, label: o.name};
                        }
                    }
                })
                .addColumn('site_a', 'Site A')
                .addColumn('site_z', 'Site Z')
                .addDateColumn('install_date', 'Install Date')
                .addColumn('est_mrc', 'MRC')
                .addColumn('est_nrc', 'NRC')
                .options();


        _this.refreshAccrualsGrid = function () {
            Recon.inventories().then(function (result) {
                accrualsGrid.data = result.data.items;
            });
        };

        _this.refreshInventoriesGrid = function () {
            Recon.invoices({params: {month: _this.month, limit: _this.pager.size, offset: _this.pager.from() - 1}}).then(function (result) {
                inventoriesGrid.data = result.data.items;
                _this.pager.total = result.data.total;
            });
        };

        _this.pager = $lcmaPager({
            onGo: function () {
                _this.refreshInventoriesGrid();
            }
        });

        this.exportToCSV = function () {
            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            _this.inventoryGridApi.exporter.csvExport('all', 'all', myElement);
        };

        this.exportAccrualsGridToCSV = function () {
            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            _this.accrualsGridApi.exporter.csvExport('all', 'all', myElement);
        };

        _this.refreshAccrualsGrid();
        _this.refreshInventoriesGrid();

        _this.addInventory = function (type) {
            var obj = _this.inventoryGridApi.selection.getSelectedRows()[0];
            $state.go('app.inventoryNewRecon', {type: type, params: obj.sp_serv_id});
        };

    }

    angular.module('lcma')
            .controller('ReconCtrl', ReconCtrl);


}());
