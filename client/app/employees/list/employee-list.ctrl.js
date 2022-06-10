/**
 * Created by bear on 2/29/16.
 */
(function () {
    'use strict';

    function EmployeesCtrl($scope, $lcmaGrid, $lcmAlert, $lcmaDialog, $lcmaGridFilter, $uibModal, $lcmaPager, $lcmaPage, uiGridConstants, $timeout, $lcmaConfirmation, Employee, Dictionary) {

        $lcmaPage.setTitle('Employee List');

        $lcmaConfirmation.setFormId('EmployeeForm');
        $lcmaConfirmation.setFormName('EmployeeForm');

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
            settingKey: 'employee.list.grid',
            exporterCsvFilename: 'employees.csv',
            multiSelect: false,
            noUnselect: true,
            onRegisterApi: function (api) {
                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.employeeQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });
                    _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {
                    $lcmaGridFilter(this.grid, _this.employeeQuery)
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
            .addColumn('first_name', 'First Name')
            .addColumn('last_name', 'Last Name')
            .addColumn('home_site', 'Home Site')
            .addNumberColumn('mobile_number', 'Mobile Number')
            .addNumberColumn('office_number', 'Office Number')
            .addRelColumn('status_id', 'Status',{
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status.value}}</div>',
                width: 120,
                filter: {
                    term: -1,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: Dictionary.getDictionary('account-status'),
                    map: function (x) {
                        return {value: x.key , label: x.value};
                    }
                }
            })
            .addNumberColumn('gl_code1', 'GL Code1')
            .addNumberColumn('gl_code2', 'GL Code2')
            .addNumberColumn('gl_code3', 'GL Code3')
            .addNumberColumn('gl_code4', 'GL Code4')
            .addNumberColumn('gl_code5', 'GL Code5')
            .addNumberColumn('gl_code6', 'GL Code6')
            .addNumberColumn('gl_code7', 'GL Code7')
            .addNumberColumn('gl_code8', 'GL Code8');

        var grid = _this.gridOptions = lcmaGrid.options();

        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
            onGo: function () {
                _this.employeeQuery.limit = _this.pager.size;
                _this.employeeQuery.offset = _this.pager.from() - 1;
                _this.refresh();
            }
        });


        /**
         * Holds employees query.
         */
        _this.employeeQuery = {
            where: {},
            limit: _this.pager.size,
            offset: _this.pager.from() - 1
        };

        /**
         * Opens add employees dialog
         */
        _this.addEmployee = function () {

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
         * Opens edit employee dialog
         */
        $scope.editEmployee = _this.editEmployee = function (employee) {
          $uibModal.open({
            templateUrl: 'app/employees/edit/employee-edit.html',
            controller: 'EmployeeEditCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window',
            resolve: {
              $currentEmployee: function () {
                return employee;
              }
            }
          }).result.then(function (data) {
              angular.extend(employee, data);
              $lcmAlert.success('Employee info has been updated.');
            });
        };

        /**
         * Initiates employee remove.
         */
        $scope.removeEmployee = _this.removeEmployee = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;

            var employee = _this.gridApi.selection.getSelectedRows()[0];

            $lcmaDialog.remove({
                message: ' Employee ' + employee.first_name + ' ' +employee.last_name
            }).result.then(function () {
                Employee.destroy(employee.id)
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
                            '$currentEmployee': item
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
                '$currentEmployee': item
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
            _this.employeeQuery.where = {};
            _this.gridApi.core.clearAllFilters(true, true, true);
            _this.refresh();
        };

        _this.refresh = function () {
          Employee.findAll({filter: JSON.stringify(_this.employeeQuery)})
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

              return data;
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
                _this.resolvesEdit = {
                    '$currentEmployee': selectedRows[0]
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
                  _this.gridApi.selection.selectRow(data); //select newly created building
                });

                $lcmAlert.success('New Employee has been created');

            }
            else {

                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                  selectedRows[0] = data;
                }

                $lcmAlert.success('Employee has been updated');

            }

            $lcmaConfirmation.resetFieldsStyle();

        };

        _this.refresh();
    }

    angular.module('lcma')
        .controller('EmployeesCtrl', EmployeesCtrl);
}());
