/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .controller('DisputeEditCtrl', function ($scope, $lcmaGrid, $lcmAlert, $uibModal, $currentDispute, Dispute, DisputeCategory,
                    $lcmaPage, Note, History, Dictionary, Document, $lcmaDialog) {

                $lcmaPage.setTitle('Dispute');

                var _this = this;
                _this.dispute = $currentDispute;

                Dictionary.getDictionary('dispute-status').then(function (data) {
                    $scope.statuses = data;
                    $scope.recalculate(true);
                });

                //dispute notes
                _this.notes = [];

                //history
                _this.history = [];

                /**
                 * Disputes grid definition
                 */
                var grid = $scope.chargesGrid = $lcmaGrid({
                    enableRowSelection: false,
                    enableRowHeaderSelection: false,
                    enableFiltering: false,
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
                                    return (op === 'asc')?a[field]>b[field]:b[field]>a[field];
                                }
                            });
                        });


                        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                            if (newValue != oldValue) {
                                if ((colDef.field === 'dispute_value_awarded')) {
                                    rowEntity.disputed_amount = rowEntity.charge.chg_amt - rowEntity.calculated_amount;
                                    if (rowEntity.dispute_value_awarded < 0 || Number(rowEntity.dispute_value_awarded) > rowEntity.disputed_amount) {
                                        rowEntity.dispute_value_awarded = oldValue;
                                    }
                                }
                                $scope.recalculate();
                            }
                        });
                    }
                })
                        .addColumn(' ', "Dispute Charge ID", {
                            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.dispute.invoice.sp_inv_num}}_{{row.entity.charge.id}}</div>',
                            width: 200,
                            enableSorting: false
                        })
                        .addColumn('charge.acct_level_1', "Account")
                        .addColumn('', "Invoice #", {
                            width: 180,
                            cellTemplate: '<div class="ui-grid-cell-contents"><a class="ui-grid-cell-contents" ui-sref="app.invoiceChargeDetails({id: row.entity.charge.invoice_id, charge:row.entity.charge.id})">{{grid.appScope.dispute.invoice.sp_inv_num}}</a></div>'
                        })
                        .addColumn('charge.invoice.inv_date', "Invoice Date", {
                            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.charge.invoice.inv_date | lcmaDate}}</div>',
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
                        .addDateColumn('charge.chg_class', "Charge Type", {width: 100})
                        .addColumn('charge.invoice.sp_serv_id', "Service ID")
                        .addColumn('content', "Dispute Description", {enableCellEdit: true, width: 140})
                        .addColumn('charge.chg_desc_1', "Charge Desc 1")
                        .addColumn('charge.chg_desc_2', "Charge Desc 2")
                        .addDateColumn('charge.beg_chg_date', "Beg Chg Date", {width: 80})
                        .addDateColumn('charge.end_chg_date', "End Chg Date", {width: 80})
                        .addNumberColumn('charge.chg_qty', 'Charge Qty')
                        .addCurrencyColumn('charge.chg_rate', 'Charge Rate')
                        .addCurrencyColumn('charge.chg_amt', 'Billed Amount')
                        .addCurrencyColumn('calculated_amount', "Calculated Charges", {
                            width: 120,
                            enableCellEdit: true,
                            editableCellTemplate:'<div class="ui-grid-cell-contents"><form name="inputForm"><input type="numeric" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
                        })
                        .addCurrencyColumn('disputed_amount', "Dispute Amount", {
                            cellTemplate: '<div class="ui-grid-cell-contents">{{(row.entity.charge.chg_amt - row.entity.calculated_amount)|currency}}</div>'
                        })
                        .addCurrencyColumn('dispute_value_awarded', "Dispute Amount Awarded", {
                            width: 170,
                            enableCellEdit: true,
                            editableCellTemplate:'<div class="ui-grid-cell-contents"><form name="inputForm"><input type="numeric" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
                        })
                        .addCurrencyColumn('payback_amount', "Payback Amount", {
                            cellTemplate: '<div class="ui-grid-cell-contents">{{(grid.appScope.calculatePaybackAmount(row.entity))|currency}}</div>'
                        })
                        .addBooleanColumn('dispute_withheld', "Withheld", {
                            width: 110,
                            enableCellEdit: true,
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
                    obj.disputed_amount = obj.charge.chg_amt - obj.calculated_amount;
                    return ($scope.dispute_withheld === $scope.chargesGrid.data.length) ?
                            (obj.dispute_value_awarded && obj.dispute_value_awarded < obj.disputed_amount ?
                                    (obj.disputed_amount - obj.dispute_value_awarded)
                                    : "")
                            : "";
                };

                /**
                 * Collect all data.
                 */
                $scope.recalculate = function () {
                    $scope.billed_charges = 0;
                    $scope.calculated_charges = 0;
                    $scope.dispute_value_awarded = 0;
                    $scope.dispute_withheld = 0;
                    $scope.resolution_date = null;
                    var has_resolution_date = true;
                    $scope.payback_amount = "";

                    var charges = $scope.dispute.dispute_charges;
                    for (var charge in charges) {
                        has_resolution_date = has_resolution_date && charges[charge].resolution_date !== null;

                        var t = charges[charge].charge.chg_amt;
                        $scope.billed_charges += parseFloat(t == null ? 0 : t);

                        t = charges[charge].calculated_amount;
                        $scope.calculated_charges += parseFloat(t == null ? 0 : t);

                        t = charges[charge].dispute_value_awarded;                        
                        $scope.dispute_value_awarded += parseFloat(t == null ? 0 : t);

                        if (charges[charge].dispute_withheld) {
                            $scope.dispute_withheld++;
                        }

                    }
                    if (has_resolution_date) {
                        $scope.resolution_date = new Date(charges.map(function (o) {
                            return new Date(o.resolution_date).getTime();
                        }).sort(function (a, b) {
                            return b - a;
                        })[0]);
                    }
                    if ($scope.chargesGrid.data && ($scope.dispute_withheld === $scope.chargesGrid.data.length) && $scope.dispute_value_awarded < ($scope.billed_charges - $scope.calculated_charges)) {
                        $scope.payback_amount = ($scope.billed_charges - $scope.calculated_charges) - $scope.dispute_value_awarded;
                    }

                    if ($scope.chargesGrid.data && $scope.statuses) {
                        var status = $scope.chargesGrid.data.map(function (o) {
                            return o.status;
                        }).indexOf(51);
                        var nullStatus = $scope.chargesGrid.data.filter(function (o) {
                            return o.status != 51 && o.status != 52 && o.status != 53;
                        }).length;
                        status = (status >= 0 || nullStatus > 0) ? 51 : 0;
                        if (status === 0) {
                            var statusT = $scope.chargesGrid.data.map(function (o) {
                                return o.status;
                            }).indexOf(52);
                            status = statusT >= 0 ? 52 : 53;
                        }
                        setStatus(status);
                    }
                };

                function setStatus(id) {
                    var ind = $scope.statuses.map(function (o) {
                        return o.key;
                    }).indexOf(id);
                    $scope.dispute.status_obj = $scope.statuses[ind];
                    $scope.dispute.status = id;
                }

                /**
                 * Update Dispute form
                 * @param form
                 */
                _this.updateDispute = function (form) {

                    if (!form.$valid) {
                        return;
                    }

                    Dispute.update(_this.dispute.id, $scope.dispute).then(function (dispute) {
                        $lcmAlert.success('Dispute info has been updated');
                    });
                };

                $scope.query = function () {

                    _this.dispute = $scope.dispute = $currentDispute;
                    for (var i in _this.dispute.dispute_charges) {
                        var t = _this.dispute.dispute_charges[i].resolution_date;
                        _this.dispute.dispute_charges[i].resolution_date = t != null ? new Date(t) : null;
                    }

                    $lcmaPage.setTitle('Dispute: ' + _this.dispute.dispute_id);


                    grid.data = _this.dispute.dispute_charges;
                    $scope.recalculate();

                    DisputeCategory.findAll().then(function (categories) {
                        $scope.categories = categories;
                    });

                    // Get notes for the dispute
                    _this.notesQuery = {
                        where: {
                            entity_id: {'==': _this.dispute.id},
                            entity_type: {'==': 'dispute'}
                        }
                    };

                    Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
                        _this.notes = notes;
                    });

                    _this.historyQuery = {
                        where: {
                            entity_type: {'==': "dispute"},
                            entity_id: {'==': _this.dispute.id}
                        }
                    };

                    History.findAll({filter: JSON.stringify(_this.historyQuery)}).then(function (history) {
                        _this.history = history;
                    });
                };

                /**
                 * Opens add note dialog
                 */
                _this.addNote = function () {

                    $uibModal.open({
                        templateUrl: 'app/note/new/note-new.html',
                        controller: 'NoteNewCtrl',
                        backdrop: 'static',
                        resolve: {
                            entityId: function () {
                                return _this.dispute.id
                            },
                            entityType: function () {
                                return 'dispute';
                            },
                            charges: function () {
                                return [];
                            }
                        }
                    })
                            .result.then(function (newNote) {
                                _this.notes.push(newNote);
                                $lcmAlert.success('Note has been created');
                            }, function () {


                            });
                };

                /**
                 * Sends reply to note.
                 * @param note
                 */
                _this.onNoteReply = function (note) {
                    Note.create({
                        entity_id: _this.dispute.id,
                        parent_id: note.id,
                        entity_type: 'dispute',
                        content: note.$reply.content
                    }).then(function (newNote) {
                        delete note.$reply;

                        if (!note.notes) {
                            note.notes = [];
                        }
                        note.notes.push(newNote);
                    });
                };

                $scope.query();



            });


}());
