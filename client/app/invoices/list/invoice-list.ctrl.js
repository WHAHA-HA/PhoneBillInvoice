'use strict';

angular.module('lcma')
        .controller('InvoicesCtrl', function ($scope, $location, $lcmAlert, $lcmaPage, $lcmaPager, $lcmaGridFilter, invoiceService, Invoice, InvoiceOpenStatus) {

            $lcmaPage.setTitle('Invoice List');

            var _this = this;
            $scope.quickFilter = [];
            InvoiceOpenStatus.findAll().then(function(values){
                _this.quickFilterStatuses = values;
            });

            /**
             * Holds grid settings
             * @type {settings}
             */

            /*    this.gridOptions = {
             columnDefs: {
             field: 'id'
             },
             rowData: []
             };*/

            $scope.onSettingsUpdate = function (settings) {
                lcmaGrid.updateFromSettings(settings, _this.gridApi);
            };
            var lcmaGrid = invoiceService.listGridSettings({
                exporterCsvFilename: 'invoices.csv',
                settingKey: 'invoices.list.grid',
                flatEntityAccess: true,
                fastWatch: true,
                onReady: function (event) {
                    event.api.sizeColumnsToFit();
                },
                onRegisterApi: function (api) {

                    _this.gridApi = api;

                    api.core.on.sortChanged($scope, function (grid, columns) {
                        _this.invoiceQuery.orderBy = columns.map(function (x) {
                            return [x.field, x.sort.direction.toUpperCase()];
                        });

                        _this.refresh();
                    });

                    api.core.on.filterChanged($scope, function (x) {

                        $lcmaGridFilter(this.grid, _this.invoiceQuery)
                                .applyAll(grid.columnDefs.filter(function (x) {
                                    return x.enableFiltering;
                                }));
                        _this.refresh();

                    });
                }

            });
            var grid = lcmaGrid.options();

            this.gridOptions = grid;

            /**
             * Holds pager instance.
             */
            _this.pager = $lcmaPager({
                onGo: function () {
                    _this.invoiceQuery.limit = _this.pager.size;
                    _this.invoiceQuery.offset = _this.pager.from() - 1;
                    _this.refresh();
                }
            });

            _this.bulkApproveDisabled = function () {
                var list = _this.gridApi.selection.getSelectedRows();
                return list.length === 0 || list.filter(function (x) {
                    return x.header.status_code !== 100;
                }).length > 0;
            };

            /**
             * Holds invoice filters
             */
            _this.invoiceFilters = invoiceService.getFilters();

            /**
             * Holds invoice query.
             */
            _this.invoiceQuery = {
              where: {},
              limit: _this.pager.size,
              offset: this.pager.from() - 1,
              orderBy: [['date_issued', 'DESC'], ['vendor_id', 'ASC'], ['sp_inv_num', 'ASC']]
            };



            $scope.$watchCollection(function () {
                return $location.search();
            }, function () {
                var qs = $location.search();
                if (qs.status) {
                    _this.invoiceQuery.where.sp_acct_status_ind = {'==': qs.status};
                } else {
                    delete _this.invoiceQuery.where.sp_acct_status_ind;
                }
                _this.refresh();
            });

            /**
             * Clears all filters.
             */
            _this.clearFilters = function () {
                _this.invoiceQuery.where = {};
                _this.gridApi.core.clearAllFilters(true, true, true);
                _this.refresh();
            };

            /**
             * Updates invoice status.
             * @param statusKey
             */
            _this.updateStatus = function (statusKey) {
                Invoice.updateAll(_this.gridApi.selection.getSelectedRows());
            };

            /**
             * Initiates export to CSV action.
             */
            _this.exportToCSV = function () {

                var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
                _this.gridApi.exporter.csvExport('all', 'all', myElement);

            };

            _this.approve = function () {
                var items = _this.gridApi.selection.getSelectedRows();
                var len = 0;
                for (var i in items) {
                    if (items[i].header.status_code !== 100) {
                        len++;
                    }
                }
                if (len > 0) {
                    $lcmAlert.error("Selected Invoices are not ready for approval.");
                    return;
                }
                var count = 0;
                for (var i in items) {
                    if (items[i].header.status_code === 100) {
                        Invoice.update(items[i].id, {
                            status: 200
                        }).then(function (data) {
                            var index = items.map(function (o) {
                                return o.id;
                            }).indexOf(data.id);
                            items[index].header.status_code = 200;
                            count++;
                            if (count === len) {
                                $lcmAlert.success("Invoices successfully approved.");
                            }
                        });
                    }
                }
            };

            $scope.applyQuickFilter = function (value) {
                if ($scope.quickFilter.length<=1 && value != -1) {
                    $scope.quickFilter= [value];
                    var option = value==78 ? {'!=': 10} : {"==": 10};
                    _this.invoiceQuery.where['header.status_code'] = option;
                } else {
                    $scope.quickFilter = [];
                    delete _this.invoiceQuery.where['header.status_code'];
                }
                _this.refresh(true);
            };

            /**
             * Refreshes data against query.
             */
            _this.refresh = function () {
                _this.invoiceQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
                return Invoice.findAll({filter: JSON.stringify(_this.invoiceQuery)})
                        .then(function (data) {

                            grid.data = invoiceService.calcNewCharges(data);

                            /*          grid.api.setRowData(data);
                             grid.api.refreshView();*/

                            _this.pager.total = data.$total;

                            return data;
                        });
            };

            _this.refresh();
        });
