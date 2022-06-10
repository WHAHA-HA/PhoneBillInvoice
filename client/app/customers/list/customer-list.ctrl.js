/**
 *
 */
(function () {
    'use strict';

    function CustomersCtrl($scope, $lcmaGrid, $lcmAlert, $lcmaDialog, $lcmaGridFilter, $uibModal, $lcmaPager, $lcmaPage, $timeout, $lcmaConfirmation, Customer) {

        $lcmaPage.setTitle('Customer List');

        $lcmaConfirmation.setFormId('CustomerForm');
        $lcmaConfirmation.setFormName('CustomerForm');

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
            settingKey: 'customers.list.grid',
            exporterCsvFilename: 'customers.csv',
            multiSelect: false,
            noUnselect: true,
            onRegisterApi: function (api) {
                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                  _this.customerQuery.orderBy = columns.map(function (x) {
                    return [x.field, x.sort.direction.toUpperCase()];
                  });
                  _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {
                    $lcmaGridFilter(this.grid, _this.customerQuery)
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
            .addColumn('company', 'Company')
            .addColumn('city', 'City')
            .addColumn('state', 'State');

        var grid = _this.gridOptions = lcmaGrid.options();

        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
          onGo: function () {
            _this.customerQuery.limit = _this.pager.size;
            _this.customerQuery.offset = _this.pager.from() - 1;
            _this.refresh();
          }
        });


        /**
         * Holds contacts query.
         */
        _this.customerQuery = {
          where: {},
          limit: _this.pager.size,
          offset: this.pager.from() - 1,
          orderBy: [['company', 'ASC']]
        };

        /**
         * Opens add customer dialog
         */
        _this.addCustomer = function () {

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
         * Opens edit customer dialog
         */
        $scope.editCustomer = _this.editCustomer = function (customer) {
          $uibModal.open({
            templateUrl: 'app/customers/edit/customer-edit.html',
            controller: 'CustomerEditCtrl',
            windowClass: 'app-modal-window',
            backdrop: 'static',
            resolve: {
              $currentCustomer: function () {
                return customer;
              }
            }
          }).result.then(function (data) {
              angular.extend(customer, data);
              $lcmAlert.success('Customer info has been updated.');
            });
        };

        /**
         * Initiates Customer remove.
         */
        $scope.removeCustomer = _this.removeCustomer = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;

            var customer = _this.gridApi.selection.getSelectedRows()[0];

            $lcmaDialog.remove({
                message: ' Customer ' + customer.company
            }).result.then(function () {
                Customer.destroy(customer.id)
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
                            '$currentCustomer': item
                        };

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
                '$currentCustomer': item
            };
        };

        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
            _this.customerQuery.where = {};
            _this.gridApi.core.clearAllFilters(true, true, true);
            _this.refresh();
        };

        _this.refresh = function () {
          Customer.findAll({filter: JSON.stringify(_this.customerQuery)})
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
                    '$currentCustomer': selectedRows[0]
                };
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
                  _this.gridApi.selection.selectRow(data); //select newly created customer
                });

                $lcmAlert.success('New Customer has been created');

            }
            else {

                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    selectedRows[0] = data;
                }

                $lcmAlert.success('Customer has been updated');

            }
            $lcmaConfirmation.resetFieldsStyle();

        };

        _this.refresh();
  }

  angular.module('lcma')
    .controller('CustomersCtrl', CustomersCtrl);
}());
