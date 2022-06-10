'use strict';

angular.module('lcma')
    .controller('VendorsCtrl', function ($scope, $location, $lcmAlert, $uibModal, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, $lcmaDialog, $timeout, $lcmaConfirmation, Vendor) {

        $lcmaPage.setTitle('Vendors');

        $lcmaConfirmation.setFormId('VendorForm');
        $lcmaConfirmation.setFormName('VendorForm');

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
            settingKey: 'vendor.list.grid',
            exporterCsvFilename: 'vendors.csv',
            multiSelect: false,
            noUnselect: true,
            onRegisterApi: function (api) {
                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.vendorQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.vendorQuery)
                    .apply('name')
                    .apply('code');

                _this.refresh();

                });

                api.selection.on.rowSelectionChanged($scope, function (row) {
                    if (!_this.currentSelection || _this.currentSelection.id !== row.entity.id) {
                        _this.select(row.entity);
                    }
                });

            }
        })
            .addColumn('name', 'Name', {width: '*'})
            .addColumn('code', 'Code', {width: 200});


        var grid = _this.vendorsGrid = lcmaGrid.options();

        /**
         * Initiates dialog for vendor edit.
         */
        $scope.editVendor = _this.editVendor = function (vendor) {
          $uibModal.open({
            templateUrl: 'app/vendors/edit/vendor-edit.html',
            controller: 'VendorEditCtrl',
            backdrop: 'static',
            size: "sm",
            resolve: {
              vendor: function () {
                return vendor;
              },
              pic: function () {
                return {
                  logo_tmp: '',
                  showCropImage: false,
                }
              }
            }
          }).result.then(function (vendorUpdated) {
            vendor = vendorUpdated;
            $lcmAlert.success('Vendor data has been updated');
          });
        };


        /**
         * Initiates vendor remove.
         */
        $scope.removeVendor = _this.removeVendor = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                return;
            var vendor = _this.gridApi.selection.getSelectedRows()[0];
            $lcmaDialog.remove({
                message: ' Vendor ' + vendor.name
            }).result.then(function () {

            Vendor.destroy(vendor.id)
                .then(function (result) {

                    $lcmaConfirmation.resetFieldsStyle();

                    // select first one,
                    if (_this.gridOptions.data.length) {
                      //need timeout to make sure grid element actually associated with variable
                      $timeout(function () {
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
            _this.vendorQuery.limit = _this.pager.size;
            _this.vendorQuery.offset = _this.pager.from() - 1;
            _this.refresh();
          }
        });

        /**
         * Holds invoice query.
         */
        _this.vendorQuery = {
          where: {},
          limit: _this.pager.size,
          offset: this.pager.from() - 1,
          orderBy: [['name', 'ASC']]
        };


        /**
         * Opens add vendor dialog
         */
        _this.newVendor = function () {

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
                            'vendor': item,
                            'vendors': _this.vendors,
                            'pic': {
                                logo_tmp: '',
                                showCropImage: false
                            }
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
                'vendor': item,
                'vendors': _this.vendors,
                'pic': {
                    logo_tmp: '',
                    showCropImage: false
                }
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
          _this.vendorQuery.where = {};
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

        /**
         * Refreshes data against query.
         */
        _this.refresh = function () {

          _this.vendorQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
          return Vendor.findAll({filter: JSON.stringify(_this.vendorQuery)})
            .then(function (data) {
              _this.pager.total = data.$total;
              grid.data = data;
              _this.vendors = data;

              // select first immediately
              if (data.length) {
                //need timeout to make sure grid element actually associated with variable
                $timeout(function () {
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
        _this.onDismiss = function (create) {
            $lcmaConfirmation.resetFieldsStyle();

            if (create) {
                return;
            }

            var selectedRows = _this.gridApi.selection.getSelectedRows();
            if (selectedRows.length > 0) {
                //_this.currentSelection = angular.copy(selectedRows[0]);
                _this.resolvesEdit = {
                    'vendor': selectedRows[0],
                    'pic': {
                        logo_tmp: '',
                        showCropImage: false,
                    }
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
        _this.onChange = function (data, create) {

            if (create) {

                grid.data.push(data);
                _this.currentSelection = data;

                $timeout(function () {

                    //_this.gridApi.selection.selectRow(grid.data[0]);
                    _this.gridApi.selection.selectRow(data); //select newly created building
                });

                $lcmAlert.success('New Vendor has been created');

            }
            else {

                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    selectedRows[0] = data;
                }

                $lcmAlert.success('Vendor has been updated');

            }

            $lcmaConfirmation.resetFieldsStyle();

        };

        _this.refresh();
    });
