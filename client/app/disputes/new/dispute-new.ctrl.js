/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .controller('DisputeNewCtrl', function ($rootScope, $scope, $lcmaGrid, $uibModalInstance, invoice, charges, Dispute, DisputeCategory, Dictionary) {

                Dictionary.getDictionary('dispute-status').then(function (data) {
                    $scope.statuses = data;
                    $scope.recalculate(true);
                });

                $scope.dispute = {};
                $scope.invoice = invoice;
                $scope.charges = charges;

                function setStatus(id) {
                    var ind = $scope.statuses.map(function (o) {
                        return o.key;
                    }).indexOf(id);
                    $scope.dispute.status_obj = $scope.statuses[ind];
                    $scope.dispute.status = id;
                }

                $scope.recalculate = function (grid) {
                    $scope.billed_charges = 0;
                    $scope.calculated_charges = 0;
                    $scope.dispute_value_awarded = 0;
                    $scope.dispute_withheld = 0;
                    $scope.resolution_date = "";
                    var has_resolution_date = true;
                    $scope.payback_amount = "";

                    for (var charge in $scope.charges) {
                        if (grid) {
                            $scope.charges[charge].billed_charges = 0;
                            $scope.charges[charge].status = 51;
                            $scope.charges[charge].dispute_value_awarded = 0;
                            $scope.charges[charge].payback_amount = 0;
                            $scope.charges[charge].dispute_withheld = false;
                        }
                        var t1 = $scope.charges[charge].chg_amt;
                        $scope.billed_charges += parseFloat(t1 == null ? 0 : t1);
                        has_resolution_date = has_resolution_date && $scope.charges[charge].resolution_date != null;

                        var t2 = $scope.charges[charge].calculated_amount;
                        $scope.calculated_charges += parseFloat(t2 == null ? 0 : t2);


                        var t3 = $scope.charges[charge].dispute_value_awarded;
                        $scope.dispute_value_awarded += parseFloat(t3 == null ? 0 : t3);

                        if ($scope.charges[charge].dispute_withheld) {
                            $scope.dispute_withheld++;
                        }

                        if (grid) {
                            $scope.charges[charge].billed_charges = t1;
                            $scope.charges[charge].calculated_amount = t2;
                            $scope.charges[charge].dispute_value_awarded = t3;
                        }


                        if (has_resolution_date) {
                            $scope.resolution_date = new Date($scope.charges.map(function (o) {
                                return new Date(o.resolution_date).getTime();
                            }).sort(function (a, b) {
                                return b - a;
                            })[0]);
                        }


                    }

                    if ($scope.chargesGrid.data && ($scope.dispute_withheld === $scope.chargesGrid.data.length) && $scope.dispute_value_awarded < ($scope.billed_charges - $scope.calculated_charges)) {
                        $scope.payback_amount = ($scope.billed_charges - $scope.calculated_charges) - $scope.dispute_value_awarded;
                    }

                    var status = $scope.charges.map(function (o) {
                        return o.status;
                    }).indexOf(51);
                    var nullStatus = $scope.charges.filter(function (o) {
                            return o.status != 51 && o.status != 52 && o.status != 53;
                        }).length;
                        status = (status >= 0 || nullStatus > 0) ? 51 : 0;
                    if (status === 0) {
                        var statusT = $scope.charges.map(function (o) {
                            return o.status;
                        }).indexOf(52);
                        status = statusT >= 0 ? 52 : 53;
                    }
                    setStatus(status);
                };


                /**
                 * Disputes grid definition
                 */
                $scope.chargesGrid = $lcmaGrid({
                    enableRowSelection: false,
                    enableRowHeaderSelection: false,
                    enableFiltering: false,
                    data: $scope.charges,
                    enableSorting: true,
                    onRegisterApi: function (gridApi) {

                        gridApi.core.on.sortChanged($scope, function (grid, columns) {
                            var field = columns[0].field;
                            var op = columns[0].sort.direction;
                            $scope.chargesGrid.data.sort(function (a, b) {
                                if (field.indexOf(".") > 0) {
                                    a = a[field.split(".")[0]];
                                    b = b[field.split(".")[0]];
                                    field = field.split(".")[1];
                                }
                                if (typeof a[field] === 'number') {
                                    if (op === 'asc') {
                                        return a[field] > b[field];
                                    } else {
                                        return a[field] < b[field];
                                    }
                                } else if (typeof a[field] === 'string') {
                                    if (op === 'asc') {
                                        return a[field].localeCompare(b[field]);
                                    } else {
                                        return b[field].localeCompare(a[field]);
                                    }
                                } else if (typeof a[field] === 'date') {
                                    if (op === 'asc') {
                                        return a[field].localeCompare(b[field]);
                                    } else {
                                        return b[field].localeCompare(a[field]);
                                    }
                                } else {
                                    return (op === 'asc') ? a[field] > b[field] : b[field] > a[field];
                                }
                            });
                        });

                        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                            if (newValue != oldValue) {
                                if (!rowEntity.billed_charges) {
                                    rowEntity.billed_charges = 0;
                                }
                                if (!rowEntity.dispute_value_awarded) {
                                    rowEntity.dispute_value_awarded = 0;
                                }
                                if (!rowEntity.calculated_amount) {
                                    rowEntity.calculated_amount = 0;
                                }
                                rowEntity.disputed_amount = Number(rowEntity.billed_charges) - rowEntity.calculated_amount;
                                if ((colDef.field === 'dispute_value_awarded')) {
                                    if (rowEntity.dispute_value_awarded < 0 || Number(rowEntity.dispute_value_awarded) > rowEntity.disputed_amount) {
                                        rowEntity.dispute_value_awarded = oldValue;
                                    }
                                }
                                $scope.recalculate(false);
                            }
                        });
                    }
                })

                        .addColumn('acct_level_1', "Account")
                        .addColumn('invoice.inv_date', "Invoice Date", {
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.invoice.inv_date | lcmaDate}}</div>',
                        })
                        .addColumn('status', "Status", {
                            width: 100,
                            cellFilter: 'lcmaDisputeStatus',
                            //cellFilter: 'mapDisputeStatus',
                            enableCellEdit: true,
                            editableCellTemplate: 'ui-grid/dropdownEditor',
                            //TODO: Put this on the single place
                            editDropdownOptionsArray: [
                                {id: 51, value: 'Filed'},
                                {id: 52, value: 'Closed - Won'},
                                {id: 53, value: 'Closed - Lost'}
                            ]
                        })
                        .addDateColumn('updated_at', "Last Update", {width: 80})
                        .addDateColumn('chg_class', "Charge Type", {width: 100})
                        .addColumn('invoice.sp_serv_id', "Service ID")
                        .addColumn('content', "Dispute Description", {enableCellEdit: true, width: 140})
                        .addColumn('chg_desc_1', "Charge Desc 1")
                        .addColumn('chg_desc_2', "Charge Desc 2")
                        .addDateColumn('beg_chg_date', "Beg Chg Date", {width: 80})
                        .addDateColumn('end_chg_date', "End Chg Date", {width: 80})
                        .addNumberColumn('chg_qty', 'Charge Qty')
                        .addCurrencyColumn('chg_rate', 'Charge Rate')
                        .addCurrencyColumn('chg_amt', 'Billed Amount')
                        .addCurrencyColumn('calculated_amount', "Calculated Charges", {
                            width: 120,
                            enableCellEdit: true
                        })
                        .addCurrencyColumn('disputed_amount', "Dispute Amount", {
                            cellTemplate: '<div class="ui-grid-cell-contents">{{(row.entity.chg_amt - row.entity.calculated_amount)|currency}}</div>'
                        })
                        .addCurrencyColumn('dispute_value_awarded', "Dispute Amount Awarded", {
                            width: 170,
                            enableCellEdit: true
                        })
                        .addCurrencyColumn('payback_amount', "Payback Amount", {
                            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.calculatePaybackAmount(row.entity)|currency}}</div>'
                        })
                        .addBooleanColumn('dispute_withheld', "Withheld", {
                            width: 110,
                            enableCellEdit: true,
                            showColumnFooter: false,
                            editableCellTemplate: 'ui-grid/dropdownEditor',
                            //TODO: Put this on the single place
                            editDropdownOptionsArray: [
                                {id: false, value: 'No'},
                                {id: true, value: 'Yes'}
                            ]
                        })
                        .addColumn('resolution_date', "Resolution Date", {
                            width: 120,
                            enableCellEdit: true,
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.resolution_date | lcmaDate}}</div>',
                            editableCellTemplate: '<div class="ui-grid-cell-contents"><input ui-grid-edit-datepicker ng-model="row.entity.resolution_date" name="date"/></div>',
                        })
                        .options();

                $scope.calculatePaybackAmount = function (obj) {
                    return ($scope.dispute_withheld === $scope.chargesGrid.data.length) ?
                            (obj.dispute_value_awarded && obj.dispute_value_awarded < obj.disputed_amount ?
                                    (obj.disputed_amount - obj.dispute_value_awarded)
                                    : "")
                            : "";
                };

                /**
                 * Collect all data.
                 */
                $scope.query = function () {
                    $scope.dispute = {
                        created_at: new Date()
                    };

                    $scope.total_charges = _.sumBy(charges, function (o) {
                        return parseFloat(o.chg_amt);
                    });


                    DisputeCategory.findAll().then(function (categories) {
                        $scope.categories = categories;
                    });
                };

                $scope.query();


                $scope.create = function (form) {

                    form.$setSubmitted();

                    if (!form.$valid) {
                        return;
                    }

                    Dispute.create({
                        invoice_id: invoice.id,
                        //content: $scope.note.content,
                        charges: charges,
                        category_id: $scope.dispute.category_id
                    }).then(function (dispute) {
                        $uibModalInstance.close(dispute);
                    });


                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            })
            .filter('mapDisputeStatus', function () {
                var statusHash = {
                    51: 'Filed',
                    52: 'Closed - Won',
                    53: 'Closed - Lost'
                };

                return function (input) {
                    if (!input) {
                        return '';
                    } else {
                        return statusHash[input];
                    }
                };
            });

}());
