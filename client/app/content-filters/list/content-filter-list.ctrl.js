/**
 *
 */
(function () {
    'use strict';

    function FilterListCtrl($scope, $modules, $lcmaPage, $lcmaGrid, $lcmaDialog, $lcmaGridFilter, $lcmAlert, $uibModal, ContentFilter,$timeout, $lcmaConfirmation) {

        $lcmaPage.setTitle('Content Filters');

        $lcmaConfirmation.setFormId('FilterForm');
        $lcmaConfirmation.setFormName('FilterForm');

        var _this = this;

        _this.modules = $modules;
        _this.filters = [];
         _this.currentSelection = {};

        _this.filterQuery = {
          where: {},
          orderBy: [['module_id', 'ASC'], ['title', 'ASC']]
        };

        _this.layout = {
           orientation: 'vertical',
          list: {
            size: 25
          },
          details: {
            size: 75
          }
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
                        _this.editFilter(item);
                        _this.currentSelection = item;

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

            _this.editFilter(item);
            _this.currentSelection = item;
        };

        _this.onSettingsUpdate = function (settings) {
          lcmaGrid.updateFromSettings(settings, _this.gridApi);
        };

        var lcmaGrid = $lcmaGrid({

            exporterCsvFilename: 'sites.csv',
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            onRegisterApi: function (api) {

                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                  _this.filterQuery.orderBy = columns.map(function (x) {
                    return [x.field, x.sort.direction.toUpperCase()];
                  });

                  _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                  $lcmaGridFilter(this.grid, _this.filterQuery)
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
            .addRelColumn('module_id', 'Module', {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.module.title}}</div>',
                filter: {
                  term: -1,
                  selectOptions: $modules.map(function (m) {
                    return {
                      value: m.key,
                      label: m.title
                    }
                  })
                }
            })
            .addColumn('title', 'Title', {width:'*'})
            .addRelColumn('type', 'Type', {
                filter: {
                  term: -1,
                  selectOptions: [
                    {value: "text", label: "Text"},
                    {value: "date", label: "Date"},
                    {value: "number", label: "Number"},
                  ]
                }
            })
            .addColumn('property_name', 'Property', {
                enableFiltering: true
            })
            .addColumn('operator', 'Operator', {
                cellClass: 'text-center',
                enableFiltering: false
            })
            .addColumn('value', 'Value', {
                enableFiltering: true,
                width: 300
            });

        var grid = _this.gridOptions = lcmaGrid.options();

        _this.addFilter = function () {

            var form = document.getElementById($lcmaConfirmation.getFormName());
            var formScope = angular.element(form).scope();

            if (formScope && formScope[$lcmaConfirmation.getFormName()].$dirty) {

                $lcmaDialog.confirm({
                    titleText: 'Please confirm',
                    bodyText: 'You have unsaved changes. Are you sure you want to leave this page?'
                })
                    .result.then(function(res) {
                        $lcmaConfirmation.resetFieldsStyle();

                        _this.gridApi.selection.clearSelectedRows();
                        _this.currentSelection = null;

                    }, function(error) {
                        $lcmaConfirmation.markDirtyFields();

                    });

                // update the selection should be fired inside confirmation dialog box
                return;
            }

            _this.gridApi.selection.clearSelectedRows();
            _this.currentSelection = null;
        };

        $scope.resolvesNew = {
            $modules: $modules
        };

        $scope.editFilter = _this.editFilter = function (filter) {
            $scope.resolvesEdit = {
                $currentFilter: filter,
                $modules: $modules
            };
        };

        $scope.deleteFilter = _this.remove = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;
            var filter = _this.gridApi.selection.getSelectedRows()[0];
            $lcmaDialog.remove({
                message: ' filter ' + filter.title
            }).result.then(function () {
                ContentFilter.destroy(filter.id)
                    .then(function(result) {
                        $lcmaConfirmation.resetFieldsStyle();
                        $lcmAlert.success('Content filter has been deleted');
                    });

            });

        };



        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
          _this.filterQuery.where = {};
          _this.gridApi.core.clearAllFilters(true, true, true);
          _this.refresh();
        };


        /**
         * Selects current module.
         * @param module
         */
        _this.selectModule = function (module) {
          if (module !== _this.selectedModule) {
            _this.selectedModule = module;
            module
              ? _this.filterQuery.where["module_id"] = {'===': module.key}
              : delete _this.filterQuery.where["module_id"];

            _this.refresh();
          }
        };

        //Discard content and reload original one
        _this.onDismiss = function(create) {

            $lcmaConfirmation.resetFieldsStyle();

            if (create) {
                return;
            }

            var selectedRows = _this.gridApi.selection.getSelectedRows();
            if (selectedRows.length > 0) {
                _this.select(angular.copy(selectedRows[0]));
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
                    _this.gridApi.selection.selectRow(data); //select newly created data
                });
                $lcmAlert.success('New Content Filter has been created');
            }
            else {
                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    selectedRows[0] = data;
                }
                $lcmAlert.success('Content Filter has been updated');
            }

            $lcmaConfirmation.resetFieldsStyle();
        };


        /**
         * Refreshes data against query.
         */
        _this.refresh = function () {
          return ContentFilter.findAll({filter: JSON.stringify(_this.filterQuery)},{ bypassCache: true })
            .then(function (data) {
              grid.data = data;
                if (data.length  && _this.gridApi) {
                    $timeout(function () {
                      _this.select(data[0]);
                      _this.gridApi.selection.toggleRowSelection(grid.data[0]);
                    });
                }

              return data;
            });
        };

        _this.refresh();

    }

    angular.module('lcma')
    .controller('FilterListCtrl', FilterListCtrl);


}());
