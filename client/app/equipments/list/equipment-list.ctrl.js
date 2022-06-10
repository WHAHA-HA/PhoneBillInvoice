/**
 * Created by bear on 2/22/16.
 */
(function () {
    'use strict';

    function EquipmentsCtrl($scope, $lcmaGrid, $lcmAlert, $lcmaDialog, $lcmaGridFilter, $uibModal, $lcmaPager, $lcmaPage, $timeout, $lcmaConfirmation, Contract, Equipment, Vendor, uiGridConstants) {

        $lcmaPage.setTitle('Equipment List');

        $lcmaConfirmation.setFormId('EquipmentForm');
        $lcmaConfirmation.setFormName('EquipmentForm');

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
            settingKey: 'equipment.list.grid',
            exporterCsvFilename: 'equipments.csv',
            multiSelect: false,
            noUnselect: true,
            onRegisterApi: function (api) {
                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.equipmentQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });
                    _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {
                    $lcmaGridFilter(this.grid, _this.equipmentQuery)
                        .applyAll(grid.columnDefs.filter(function (x) {
                            return x.enableFiltering;
                        }));
                    _this.refresh();
                });

                api.selection.on.rowSelectionChanged($scope, function (row) {
                    if (!_this.currentSelection || _this.currentSelection.id !== row.entity.id) {
                        _this.select(row.entity);
                    }
                });

            }
        })
            .addColumn('equip_type', 'Equipment Type')
            .addColumn('equip_maker', 'Equipment Maker')
            .addColumn('equip_model', 'Equipment Model')
            .addColumn('site.site_id', 'Site Name')
            .addColumn('equip_serial', 'Equipment Serial')
            .addDateColumn('acq_date', 'Acq Date')
            .addDateColumn('in_svc_date', 'In Svc Date')
            .addRelColumn('vendor_id', 'Vendor', {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.vendor.name}}</div>',
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
            .addRelColumn('contract_id', 'Contract', {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.contract.name}}</div>',
                filter: {
                    term: -1,
                    nulls: true,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: Contract.findAll(),
                    map: function (o) {
                        return {value: o.id, label: o.name};
                    }
                }
            });

        var grid = _this.gridOptions = lcmaGrid.options();

        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
            onGo: function () {
                _this.equipmentQuery.limit = _this.pager.size;
                _this.equipmentQuery.offset = _this.pager.from() - 1;
                _this.refresh();
            }
        });


        /**
         * Holds contacts query.
         */
        _this.equipmentQuery = {
            where: {},
            limit: _this.pager.size,
            offset: this.pager.from() - 1,
            orderBy: [['equip_type', 'ASC'], ['equip_maker', 'ASC'], ['equip_model', 'ASC']]
        };

        /**
         * Opens add equipment dialog
         */
        _this.addEquipment = function () {

            var form = document.getElementById($lcmaConfirmation.getFormName());
            var formScope = angular.element(form).scope();

            if (formScope && formScope[$lcmaConfirmation.getFormName()].$dirty) {

                $lcmaDialog.confirm({
                    titleText: 'Please confirm',
                    bodyText: 'You have unsaved changes. Are you sure you want to leave this page?'
                })
                    .result.then(function(res) {
                        $lcmaConfirmation.resetFieldsStyle();
                        _this.currentSelection = null;
                        _this.gridApi.selection.clearSelectedRows();

                    }, function(error) {
                        $lcmaConfirmation.markDirtyFields();

                    });

                // update the selection should be fired inside confirmation dialog box
                return;
            }

            _this.currentSelection = null;
            _this.gridApi.selection.clearSelectedRows();
        };

        /**
         * Opens edit equipment dialog
         */
        $scope.editEquipment = _this.editEquipment = function (equipment) {
            $uibModal.open({
                templateUrl: 'app/equipments/edit/equipment-edit.html',
                controller: 'EquipmentEditCtrl',
                windowClass: 'app-modal-window',
                backdrop: 'static',
                resolve: {
                    $currentEquipment: function () {
                        return equipment;
                    }
                }
            }).result.then(function (data) {
                angular.extend(equipment, data);
                $lcmAlert.success('Equipment info has been updated.');
            });
        };

        /**
         * Initiates Equipment remove.
         */
        $scope.removeEquipment = _this.removeEquipment = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;
            var equipment = _this.gridApi.selection.getSelectedRows()[0];
            $lcmaDialog.remove({
                message: ' Equipment ' + equipment.equip_model
            }).result.then(function () {
                Equipment.destroy(equipment.id)
                    .then(function (result) {

                        $lcmaConfirmation.resetFieldsStyle();

                            // select first one,
                        if (_this.gridOptions.data.length) {
                            //need timeout to make sure grid element actually associated with variable
                            $timeout(function () {
                                _this.select(_this.gridOptions.data[0]);
                                _this.gridApi.selection.selectRow(_this.gridOptions.data[0]);
                            });
                        } else {
                            _this.currentSelection = null;
                        }

                    })
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
         * Selects an item
         * @param item
         */
        _this.select = function (item) {
            var formScope = angular.element(document.getElementById($lcmaConfirmation.getFormId())).scope();

            if (formScope && formScope[$lcmaConfirmation.getFormId()].$dirty) {

                $lcmaDialog.confirm({
                    titleText: 'Please confirm',
                    bodyText: 'You have unsaved changes. Are you sure you want to leave this page?'
                })
                    .result.then(function(res) {

                        $lcmaConfirmation.resetFieldsStyle();
                        _this.currentSelection = item;
                        _this.resolvesEdit = {
                            '$currentEquipment': item
                        };

                        formScope[$lcmaConfirmation.getFormId()].$setPristine();

                    }, function(error) {

                        //select previous item in the grid
                        if (!_this.currentSelection) {
                            _this.gridApi.selection.clearSelectedRows();
                        }
                        else {
                            _this.gridApi.selection.selectRow(_this.currentSelection);
                        }

                        $lcmaConfirmation.markDirtyFields();

                    });

                // update the selection should be fired inside confirmation dialog box
                return;

            }


            _this.currentSelection = item;
            _this.resolvesEdit = {
                '$currentEquipment': item
            };

            $timeout(function() {
                var formScope = angular.element(document.getElementById($lcmaConfirmation.getFormId())).scope();
                formScope && formScope[$lcmaConfirmation.getFormId()].$setPristine(); // if only formScope is valid
            });

        };

        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
            _this.equipmentQuery.where = {};
            _this.gridApi.core.clearAllFilters(true, true, true);
            _this.refresh();
        };

        //Discard content and reload original one
        _this.onDismiss = function (create) {

            $lcmaConfirmation.resetFieldsStyle();

            if (create) {
                return;
            }

            var selectedRows = _this.gridApi.selection.getSelectedRows();
            if (selectedRows.length > 0) {
                //_this.currentSelection = angular.copy(selectedRows[0]);
                _this.resolvesEdit = {
                    '$currentEquipment': selectedRows[0]
                };

                // reset the confirmation ng-modifled styles
                $lcmaConfirmation.dismissForm();
            }

        };

        /**
         *
         * @param data: object return from create/update
         * @param create: boolean
         */
        _this.onChange = function (data, create) {

            if (create) {

                grid.data.push(data);
                _this.currentSelection = data;

                $timeout(function () {

                    //_this.gridApi.selection.selectRow(grid.data[0]);
                    _this.gridApi.selection.selectRow(data); //select newly created building
                });

                $lcmAlert.success('New Equipment has been created');

            } else {

                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    selectedRows[0] = data;
                }

                $lcmAlert.success('Equipment has been updated');

            }
            $lcmaConfirmation.resetFieldsStyle();

        };

        _this.refresh = function () {
            Equipment.findAll({filter: JSON.stringify(_this.equipmentQuery)})
                .then(function (data) {
                    grid.data = data;
                    _this.pager.total = data.$total;

                    // select first immediately
                    if (data.length) {
                        //need timeout to make sure grid element actually associated with variable
                        $timeout(function () {
                            _this.select(data[0]);
                            _this.gridApi.selection.selectRow(grid.data[0]);
                        });
                    } else {
                        _this.currentSelection = null;
                    }

                });
        };

        _this.refresh();
    }

    angular.module('lcma')
            .controller('EquipmentsCtrl', EquipmentsCtrl);
}());
