/**
 *
 */
(function () {
    'use strict';

    function BuildingsCtrl($scope, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, $timeout, $state, $lcmaConfirmation, Building) {

        $lcmaPage.setTitle('Building List');

        $lcmaConfirmation.setFormId('BuildingForm');
        $lcmaConfirmation.setFormName('BuildingForm');

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
            settingKey: 'buildings.list.grid',
            exporterCsvFilename: 'buildings.csv',
            multiSelect: false,
            noUnselect: true,
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

                api.selection.on.rowSelectionChanged($scope, function (row) {

                    // this code for preventing duplicate showing of 'unsaved data' dialog box
                    if (!_this.currentSelection || _this.currentSelection.id !== row.entity.id) {
                        _this.select(row.entity);
                    }

                });
            }

        })
            .addColumn('name', 'Building Name',{
                width: '*'
            })
            .addColumn('addr_1', 'Address 1')
            .addColumn('addr_2', 'Address 2')
            .addColumn('addr_3', 'Address 3')
            .addColumn('addr_city', 'City')
            .addColumn('addr_state', 'State')
            .addColumn('addr_zip', 'ZIP')
            .addColumn('geocode', 'Geocode');

        var grid = _this.gridOptions =  lcmaGrid.options();

        /**
         * Initiates Building remove.
         */
        $scope.removeBuilding = _this.removeBuilding = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;

            var building = _this.gridApi.selection.getSelectedRows()[0];
            $lcmaDialog.remove({
                message: ' Building ' + building.name
            }).result.then(function () {
                Building.destroy(building.id)
                .then(function(result) {

                    $lcmaConfirmation.resetFieldsStyle();

                    // select first one,
                    if (_this.gridOptions.data.length) {
                        //need timeout to make sure grid element actually associated with variable
                        $timeout(function() {
                            _this.select(_this.gridOptions.data[0]);
                            _this.gridApi.selection.selectRow(_this.gridOptions.data[0]);
                        });
                    }
                    else {
                        _this.currentSelection = null;
                    }

                });
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
          offset: this.pager.from() - 1,
          orderBy: [['name', 'ASC']]
        };

        /**
         * Opens add building dialog
         */
        _this.addBuilding = function () {

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
         * Selects an item
         * @param item
         */
        _this.select = function (item) {

            var formScope = angular.element(document.getElementById($lcmaConfirmation.getFormId())).scope();

            if (formScope && formScope[$lcmaConfirmation.getFormId()].modified) {

                $lcmaDialog.confirm({
                    titleText: 'Please confirm',
                    bodyText: 'You have unsaved changes. Are you sure you want to leave this page?'
                })
                    .result.then(function(res) {

                        $lcmaConfirmation.resetFieldsStyle(); // remove 'show-modified' from form
                        _this.currentSelection = item;
                        _this.resolvesEdit = {
                            '$currentBuilding': item
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
                '$currentBuilding': item
            };

            formScope && formScope[$lcmaConfirmation.getFormId()].$setPristine(); // if only formScope is valid


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

              // select first immediately
              if (data.length) {
                //need timeout to make sure grid element actually associated with variable
                $timeout(function() {
                  _this.select(data[0]);
                  _this.gridApi.selection.selectRow(grid.data[0]);
                });
              }
              else {
                _this.currentSelection = null;
              }

            });

        };


        //Discard content and reload original one
        _this.onDismiss = function(create) {

            $lcmaConfirmation.resetFieldsStyle();

            if (create) {
                return;
            }

            var selectedRows = _this.gridApi.selection.getSelectedRows();
            if (selectedRows.length > 0) {
                //_this.currentSelection = angular.copy(selectedRows[0]);
                _this.resolvesEdit = {
                  '$currentBuilding': selectedRows[0]
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
        _this.onChange = function(data, create) {

            if (create) {

                grid.data.push(data);
                _this.currentSelection = data;

                $timeout(function() {

                  //_this.gridApi.selection.selectRow(grid.data[0]);
                  _this.gridApi.selection.selectRow(data); //select newly created building
                });

                $lcmAlert.success('New Building has been created');

            }
            else {

                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                  selectedRows[0] = data;
                }

                $lcmAlert.success('Building has been updated');

            }
            
            $lcmaConfirmation.resetFieldsStyle();

        };



        _this.refresh();

    }

    angular.module('lcma')
    .controller('BuildingsCtrl', BuildingsCtrl);

}());
