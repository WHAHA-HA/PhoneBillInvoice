/**
 *
 */
(function () {
    'use strict';

    function SitesCtrl($scope, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, uiGridConstants, $lcmaDialog, $timeout, $lcmaConfirmation, Site, Vendor, Building, Dictionary) {

        $lcmaPage.setTitle('Site List');

        $lcmaConfirmation.setFormId('SiteForm');
        $lcmaConfirmation.setFormName('SiteForm');


        var _this = this;

        _this.layout = {
            orientation: 'vertical',
            list: {
                size: 27
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
            settingKey: 'sites.list.grid',
            exporterCsvFilename: 'sites.csv',
            multiSelect: false,
            noUnselect: true,
            onRegisterApi: function (api) {

                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.siteQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                    _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.siteQuery)
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
        .addColumn('site_id', 'Site Name', {
            cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.site_id}}</div>'
        })
        .addRelColumn('vendor_id', "Vendor", {
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.vendor.name}}</div>',
            width: 120,
            filter: {
                term: -1,
                type: uiGridConstants.filter.SELECT,
                selectOptions: Vendor.findAll(),
                map: function (x) {
                      return {value: x.id , label: x.name};
                }
            }
        })
        .addRelColumn('building_id', 'Building', {
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.building.name}}</div>',
            width: 120,
            filter: {
                term: -1,
                type: uiGridConstants.filter.SELECT,
                selectOptions: Building.findAll(),
                map: function (x) {
                    return {value: x.id , label: x.name};
                }
            }
        })
        .addRelColumn('site_type', 'Site Type', {
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.type.value}}</div>',
            width: 120,
            filter: {
                term: -1,
                type: uiGridConstants.filter.SELECT,
                selectOptions: Dictionary.getDictionary('site-type'),
                map: function (x) {
                    return {value: x.key , label: x.value};
                }
            }
        })
        .addColumn('building.addr_1', 'Address 1')
        .addColumn('building.addr_2', 'Address 2')
        .addColumn('building.addr_3', 'Address 3')
        .addColumn('city_state_zip', 'City/State/Zip', {
            enableFiltering: true,
            width: 160,
            cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.building.addr_city}}, {{row.entity.building.addr_state}}, {{row.entity.building.addr_zip}}</div>'
        })
        .addColumn('floor', 'Floor', {
            width: 60
        })
        .addColumn('room', 'Room', {
             width: 60
        });

        var grid = _this.gridOptions = lcmaGrid.options();

        /**
         * Initiates Site remove.
         */
        $scope.removeSite = _this.removeSite = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;
            var site = _this.gridApi.selection.getSelectedRows()[0];
            $lcmaDialog.remove({
                message: ' Site ' + site.site_id
            }).result.then(function () {
                Site.destroy(site.id)
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

                    })
            });
       };

        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
            onGo: function () {
                _this.siteQuery.limit = _this.pager.size;
                _this.siteQuery.offset = _this.pager.from() - 1;
                _this.refresh();
            }
        });


        /**
         * Holds sites query.
         */
        _this.siteQuery = {
            where: {},
            limit: _this.pager.size,
            offset: this.pager.from() - 1,
            orderBy: [['site_id', 'ASC'], ['vendor_id', 'ASC']]
        };

        /**
         * Opens add site dialog
         */
        _this.addSite = function () {

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
         * Opens add site dialog
         */
        $scope.editSite = _this.editSite = function (site) {

            $uibModal.open({
                templateUrl: 'app/sites/edit/site-edit.html',
                controller: 'SiteEditCtrl',
                windowClass: 'app-modal-window',
                backdrop: 'static',
                resolve: {
                  $currentSite: function () {
                    return site;
                  }
                }
            }).result.then(function (data) {
                angular.extend(site, data);
                $lcmAlert.success('Site info has been updated.');
            });

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

                        $lcmaConfirmation.resetFieldsStyle();
                        _this.currentSelection = item;
                        _this.resolvesEdit = {
                            '$currentSite': item
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
                '$currentSite': item
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
            _this.siteQuery.where = {};
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

        _this.refresh = function () {

            Site.findAll({filter: JSON.stringify(_this.siteQuery)})
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
                    '$currentSite': selectedRows[0]
                };

                // reset the confirmation ng-modified styles
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
                    _this.gridApi.selection.selectRow(data); //select newly created Site
                });

                $lcmAlert.success('New Site has been created');

            }
            else {

                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    selectedRows[0] = data;
                }

                $lcmAlert.success('Site has been updated');

            }
            $lcmaConfirmation.resetFieldsStyle();

        };


        _this.refresh();

    }

    angular.module('lcma')
    .controller('SitesCtrl', SitesCtrl);

}());
