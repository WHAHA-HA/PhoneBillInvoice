'use strict';

angular.module('lcma')
  .controller('InvoiceShowCtrl', function ($scope, $http, $state, $filter, $timeout, $lcmAlert, $stateParams, $lcmaGrid, $lcmaGridFilter, $lcmaPage, $lcmaPager, $lcmaFocus, $uibModal, invoiceService, uiGridConstants,
                                           Invoice, Charge, Note, Dispute, User, InvoiceChargeStatus, $me, SettingsService, $lcmaDialog, GlCodesNonVer, $lcmaSetting, chargeId) {

    $lcmaPage.setTitle('Invoice Detail');

    var _this = this;

    _this.gridColSettings = [];
    _this.selectedCols = []; // represent the columns of grid
    _this.pagerSetting = null;

    /**
     * Holds charge statuses
     */
    _this.chargeStatuses = InvoiceChargeStatus.findAll()
      .then(function (data) {
        _this.chargeStatusesList = data;
        return data;
      });

    // TODO: Move this to service
    _this.invoiceFlowScheme = [
      {
        name: 'New', statuses: [
        {
          key: 0, name: "New", action: true, input: true,
          actions: [
            {
              key: 'reset',
              name: 'Reset to New?',
              labelMessage: 'Reset to New?',
              to: 20,
              requireReason: true,
              class: "btn-success"
            }
          ]
        },
        {
          key: 10, name: "New (Rejected)", action: true, input: true,
          actions: [
            {
              key: 'reset',
              name: 'Reset to New?',
              labelMessage: 'Reset to New?',
              to: 20,
              requireReason: true,
              class: "btn-success"
            }
          ]
        },
        {
          key: 20, name: "New (Reset)", action: true, input: true,
          actions: [
            {
              key: 'reset',
              name: 'Reset to New?',
              labelMessage: 'Reset to New?',
              to: 20,
              requireReason: true,
              class: "btn-success"
            }
          ]
        }
      ]
      },
      {key: 100, name: 'Ready for Approval', to: 100},
      {
        key: 200,
        name: 'Approved',
        actionName: 'Approve/Reject',
        actions: [
          {key: 'approve', name: 'Approve', to: 200, class: "btn-success"},
          {
            key: 'reject',
            name: 'Reject',
            to: 10,
            requireReason: true,
            class: "btn-danger",
            labelMessage: "Please type rejection reason below prior to clicking Confirm."
          }
        ]
      },
      {
        key: 300, name: 'Output File Created',
        actionName: 'Create Output File',
        dialogTitleText: 'Create Output File?',
        dialogBodyText: 'Create output file for the invoice?'
      },
      {
        key: 400, name: 'Reverse AP Feed Received',
        dialogBodyText: 'Revert to New? Note that AP output file will be deleted.',
        to: 20
      }

    ];

    /**
     * Holds info status
     * TODO: Move this to service
     */
    _this.infoIndicatorValues = [
      {value: 'Y', label: 'Y'},
      {value: 'N', label: 'N'}
    ];

    /**
     * Holds list of invoice notes.
     */
    _this.notes = [];

    /**
     * Holds list of invoice disputes.
     */
    _this.disputes = [];


    /**
     * Holds charges filter query.
     */
    _this.chargesQuery = {};


    /**
     * Holds charges quick filter value.
     */
    _this.chargesQuickFilter = -1;

    /**
     * Holds notes filter query.
     */
    _this.notesQuery = {};

    /**
     * Charges grid definition
     */
     var lcmaGrid=  $lcmaGrid({
      exporterCsvFilename: 'invoice_charges.csv',
      settingKey: 'invoice.charge.list.grid',
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: true,
      rowEquality: function (x, y) {
        return x.id === y.id;
      },
      onRegisterApi: function (api) {

          // this function is called multiple times and try to prevent overwrtie
          if (_this.chargesGridApi) {
              return;
          }

        _this.chargesGridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.chargesQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.queryCharges();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.chargesQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.queryCharges();

        });


        api.selection.on.rowSelectionChanged($scope, function (row) {

          var existingRow = findRowByEntityId(_this.chargesSelectionGrid.data, row.entity.id);

          if (row.isSelected && !existingRow) {
            _this.chargesSelectionGrid.data.push(row.entity);
            $timeout(function () {
              _this.chargesSelectionGridApi.selection.selectRow(row.entity);
            });

          }
          else if (!row.isSelected && existingRow) {
            _this.chargesSelectionGrid.data.splice(existingRow.index, 1);
          }

          /**
           * check this charge is already included in existing disputes
           */
          _this.chargeExist = false;

          for (var j=0; j < _this.chargesSelectionGrid.data.length; j++) {
            var item = _this.chargesSelectionGrid.data[j];

            for (var i=0; i< _this.disputesGrid.data.length; i++) {

              var disputeItem = _this.disputesGrid.data[i];

              // The `_.matches` iterate shorthand.
              if (_.find(disputeItem.charges, { id: item.id})) {
                _this.chargeExist = true;
                return;
              }

            }
          }

        });

        //api.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
        //  _this.updateColVisibleDefs(changedColumn.colDef, 'charge_grids_col_defs');
        //});

        // calculate and stores each column width
        api.colResizable.on.columnSizeChanged($scope, function (colDef, deltaChange) {
          colDef.width += deltaChange;
        });

      }

    }).addCommandColumn('charge_disputes', " ", {
        cellTemplate: '<div  ng-class="{\'text-muted\': !row.entity.charge_disputes.length, \'text-danger\': row.entity.charge_disputes.length}" class="ui-grid-cell-contents" ng-click="grid.appScope.viewDispute(row.entity)"><i class="fa fa-warning font-lg"></i></div>',
        enableHiding: false,
        exporterSuppressExport: true
      })
      .addCommandColumn('note_charges', "  ", {
        cellTemplate: '<div ng-class="{\'text-muted\': !row.entity.note_charges.length, \'text-info\': row.entity.note_charges.length}" class="ui-grid-cell-contents" ng-click="grid.appScope.viewNotes(row.entity)"><i class="fa fa-comment font-lg"></i></div>',
        enableHiding: false,
        exporterSuppressExport: true
      })
      .addColumn('acct_level_2', "Subaccount")
      .addRelColumn('chg_class', "Charge Type", {
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: _this.chargeStatuses,
          map: function (x) {
            return {value: x.custom_key, label: x.value};
          }
        }
      })
      .addColumn('chg_desc_1', "Charge Desc 1")
      .addColumn('chg_desc_2', "Charge Desc 2")
      .addColumn('sp_serv_id', "SPID")
      .addDateColumn('beg_chg_date', "Install Date")
      .addColumn('address', "Service Address")
      .addCurrencyColumn('chg_amt', "Charge Amount");
      var grid = _this.chargesGrid = lcmaGrid.options();

    $scope.onSettingsUpdate = function (settings) {
        lcmaGrid.updateFromSettings(settings, _this.chargesGridApi);
        lcmaGridSel.updateFromSettings(settings, _this.chargesSelectionGridApi);
    };

    //_this.chargesGridOption = _this.chargesGrid.options();

    _this.exportToCSV = function () {
        var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
        if (!_this.chargesSelectionVisible) {
            _this.chargesGridApi.exporter.csvExport('all', 'all', myElement);
        } else {
            _this.chargesSelectionGridApi.exporter.csvExport('all', 'all', myElement);
        }
    };
    /**
     * Charges selection grid definition
     */
     var lcmaGridSel =  $lcmaGrid({
      exporterCsvFilename: 'selected_invoice_charges.csv',
      //data: _this.selectedCharges,
       settingKey: 'invoice.charge.list.grid',
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: false,
      rowEquality: function (x, y) {
        return x.id === y.id;
      },
      onRegisterApi: function (api) {

          if (_this.chargesSelectionGridApi) {
              return;
          }

        _this.chargesSelectionGridApi = api;

        api.selection.on.rowSelectionChanged($scope, function (row) {
          if (!row.isSelected) {
            var existingRow = findRowByEntityId(_this.chargesSelectionGrid.data, row.entity.id);
            _this.chargesSelectionGrid.data.splice(existingRow.index, 1);
            _this.chargesGridApi.selection.unSelectRow(row.entity);
          }
        });

        api.core.on.columnVisibilityChanged($scope, function (changedColumn) {
          _this.updateColVisibleDefs(changedColumn.colDef, 'charge_selection_grids_col_defs');
        });

      }
    })
      .addCommandColumn('charge_disputes', " ", {
        cellTemplate: '<div  ng-class="{\'text-muted\': !row.entity.charge_disputes.length, \'text-danger\': row.entity.charge_disputes.length}" class="ui-grid-cell-contents" ng-click="grid.appScope.viewDispute(row.entity)"><i class="fa fa-warning font-lg"></i></div>',
        enableHiding: false,
        exporterSuppressExport: true
      })
      .addCommandColumn('note_charges', "  ", {
        cellTemplate: '<div ng-class="{\'text-muted\': !row.entity.note_charges.length, \'text-info\': row.entity.note_charges.length}" class="ui-grid-cell-contents" ng-click="grid.appScope.viewNotes(row.entity)"><i class="fa fa-comment font-lg"></i></div>',
        enableHiding: false,
        exporterSuppressExport: true
      })
      .addColumn('acct_level_2', "Subaccount")
      .addRelColumn('chg_class', "Charge Type", {
        filter: {
          term: -1,
          type: uiGridConstants.filter.SELECT,
          selectOptions: _this.chargeStatuses,
          map: function (x) {
            return {value: x.custom_key, label: x.value};
          }
        }
      })
      .addColumn('chg_desc_1', "Charge Desc 1")
      .addColumn('chg_desc_2', "Charge Desc 2")
      .addColumn('sp_serv_id', "SPID")
      .addDateColumn('beg_chg_date', "Install Date")
      .addColumn('address', "Service Address")
      .addCurrencyColumn('chg_amt', "Charge Amount");
      _this.chargesSelectionGrid = lcmaGridSel.options();

    /**
     * Disputes grid definition
     */
    _this.disputesGrid = $lcmaGrid({
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: false
    })
    //.addColumn('id', "ID")
      .addColumn('dispute_id', "Dispute ID", {
        width: 250,
        cellTemplate: '<a class="ui-grid-cell-contents" ui-sref=" app.disputeEdit({id: row.entity.id}) ">{{row.entity.dispute_id || \'View\'}}</a>'
      })
      /*
       .addColumn('content', "Comment", {
       cellTemplate: '<a class="ui-grid-cell-contents" ui-sref="app.disputeDetails({id: row.entity.id})">{{row.entity.content}}</a>'
       })*/
      .addDateColumn('user.username', "Filed By")
      .addDateColumn('created_at', "Filed At")
      .addCurrencyColumn('total_amount', "Charge Amount")
      .addCurrencyColumn('calculated_amount', "Calculated Amount", {width: 140})
      .addCurrencyColumn('disputed_amount', "Disputed Amount")
      .addCurrencyColumn('amount_withheld', "Amount Withheld")
      .options();


    /**
     * SubAccounts grid definition
     */
    _this.subAccountsGrid = $lcmaGrid({
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      enableFiltering: false
    })
        .addColumn('acct_level_2', "Sub Account")
        .addCurrencyColumn('prev_bill_amt', "Prev Bill Amount")
        .addCurrencyColumn('pmts_rcvd', "Payments Received")
        .addCurrencyColumn('bal_fwd_adj', "Balance Forward Adj")
        .addCurrencyColumn('bal_fwd', "Balance Forward")
        .addCurrencyColumn('tot_mrc_chgs', "Total MRCs")
        .addCurrencyColumn('tot_occ_chgs', "Total OCCs")
        .addCurrencyColumn('tot_usage_chgs', "Total Usage")
        .addCurrencyColumn('tot_taxsur', "Total Taxes / Surcharges")
        .addCurrencyColumn('tot_disc_amt', "Total Discounts")
        .addCurrencyColumn('tot_new_chg_adj', "New Charge Adj")
        .addCurrencyColumn('tot_new_chgs', "Total New Charges")
        .addCurrencyColumn('tot_amt_due_adj', "Total Amount Due Adj")
        .addCurrencyColumn('tot_amt_due', "Total Amount Due")
      .options();


    function findRowByEntityId(list, id) {

      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i].id === id) {
          return {item: list[i], index: i};
        }
      }
    }

    function restoreSelection(gridApi, selections) {

      angular.forEach(selections, function (row) {
        gridApi.selection.selectRow(row.entity);
      })
    }

    _this.onFlowAction = function (item, action, data) {

      var status = action ? action.to : (item.to || item.key);
      Invoice.update(_this.invoice.id, {
        status: status,
        note: data.note
      }).then(function (x) {
        if (status == 20) {
          data.note =
          {
            entity_id: _this.invoice.id,
            entity_type: "invoice",
            content: "Reset to New: " + data.note
          };
        } else if (status == 10) {
          data.note =
          {
            entity_id: _this.invoice.id,
            entity_type: "invoice",
            content: "INVOICE REJECTED: " + data.note
          };
        } else if (data.note !== "" && data.note !== true) {
          data.note =
          {
            entity_id: _this.invoice.id,
            entity_type: "invoice",
            content: data.note
          };
        }
        if (data.note !== "" && data.note !== true) {
          Note.create(data.note).then(function (note) {
            _this.notes.push(note);
          });
        }
        _this.invoice.header.status_code = status;
        angular.extend(_this.invoice, x);
      });
    };

    /**
     * View dispute details
     * @param charge
     */
    $scope.viewDispute = function (charge) {
      if (charge.charge_disputes.length) {
         //_this.viewDispute(charge.charge_disputes[0].dispute_id);
         $state.go('app.disputeEdit', {id: charge.charge_disputes[0].dispute_id});

       }
    };


    /**
     * View charge notes
     * @param charge
     */
    $scope.viewNotes = function (charge) {
      if (charge.note_charges.length) {
        _this.activateRelatedTab(1);
        $lcmaFocus('note_' + charge.note_charges[0].note_id);
      }
    };

    /**
     * Clears all filters.
     */
    _this.clearChargesFilters = function () {
      _this.chargesQuery.where = {invoice_id:{'===':_this.invoice.id}};
      _this.chargesGridApi.core.clearAllFilters(true, true, true);
      _this.queryCharges();
    };

    /**
     * Holds pager instance.
     */
    _this.ChargesPager = $lcmaPager({
      onGo: function () {
        _this.chargesQuery.limit = _this.ChargesPager.size;
        _this.chargesQuery.offset = _this.ChargesPager.from() - 1;

        /**
         * Save Pager Size in Settings Table
         */
        $lcmaSetting.insertOrUpdate(_this.pagerSetting, 'invoice_show_pager', $me.id, {size: _this.ChargesPager.size}, 'Invoice Default Pager', true)
          .then(function (result) {
            _this.pagerSetting = result;
          });

        _this.queryCharges();
      }
    });

    /**
     * Holds invoice query.
     */
    _this.chargesQuery = {
      where: {},
      limit: _this.ChargesPager.size,
      offset: _this.ChargesPager.from() - 1
    };

    _this.activateRelatedTab = function (tab) {
      _this.relatedTabs = {active: tab};
    };

    _this.activateRelatedTab(0);
    /**
     * Apply charges quick filter
     * @param status
     */
    _this.applyChargesQuickFilter = function (status) {
      _this.chargesQuickFilter = status;

      if (status === 'selection') {
        _this.chargesSelectionVisible = true;
        $timeout(function () {
          _this.chargesGridApi.core.refresh();
        }, 10);
      }
      else if (!status || status == -1) {
        _this.chargesSelectionVisible = false;
        delete _this.chargesQuery.where['chg_class'];
        _this.queryCharges();
      }
      else {
        _this.chargesSelectionVisible = false;

        // TODO: Investigate. We shouldn't hardcode these
        var value = {'==': status};

        if (status === 'tax') {
          value = {'in': ['tax', 'sur']}
        }

        else if (status === 'adj') {
          value = {'in': ['adjnc', 'adjbf', 'adjad']}
        }
        _this.chargesQuery.where['chg_class'] = value;
        _this.queryCharges();
      }
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
            return _this.invoice.id
          },
          entityType: function () {
            return 'invoice'
          },
          charges: function () {
            return _this.chargesSelectionGrid.data
          }
        }
      }).result.then(function (newNote) {

          /**
           * Find the charges from charges grid, selectionGrid for newNote.charges and mark them
           */
          angular.forEach(newNote.charges, function (ch) {

              var item = _.find(_this.chargesGrid.data, {id: ch.id});

              if (item) {
                  item.note_charges.push({}); // just add empty object so that the note icon will be enabled
              }

          });

          _this.chargesGridApi.selection.clearSelectedRows();
          _this.chargesSelectionGrid.data = [];

        _this.notes.push(newNote);
        $lcmAlert.success('Note has been created');
      }, function () {

      });
    };


    /**
     * Opens add dispute dialog
     */
    _this.addDispute = function () {

        $uibModal.open({
        templateUrl: 'app/disputes/new/dispute-new.html',
        controller: 'DisputeNewCtrl',
        size: 'vlg',
        backdrop: 'static',
        resolve: {
            invoice: function () {
                return _this.invoice;
            },
            charges: function () {
                return _this.chargesSelectionGrid.data;
            }
        }
        }).result.then(function (newDispute) {

            _this.disputesGrid.data.push(newDispute);
            _this.chargeExist = true; // since selections are added, disabled the button

            /**
             * Add new Charge Dispute Object
              */

            angular.forEach(newDispute.charges, function (ch) {

                var item = _.find(_this.chargesGrid.data, {id: ch.id});

                if (item) {
                    item.charge_disputes.push({dispute_id: newDispute.id}); // just add empty object so that the note icon will be enabled
                }

            });

            // clear the selection
            _this.chargesGridApi.selection.clearSelectedRows();
            _this.chargesSelectionGrid.data = [];


            $lcmAlert.success('Dispute has been created');
        }, function () {

        });
    };

    /**
     * Opens view dispute dialog
     */
    $scope.viewDisputeDetails = function (dispute_id) {

      $uibModal.open({
        templateUrl: 'app/disputes/edit/dispute-edit.html',
        controller: 'DisputeEditCtrl',
        size: 'vlg',
        backdrop: 'static',
        resolve: {
          $currentDispute: function () {
            return Dispute.find(dispute_id);
          }
        }
      }).result.then(function (newDispute) {
        $lcmAlert.success('Dispute has been updated');
      }, function () {

      });
    };


    /**
     * Show Setting Column Fields Dialogbox
     */
    $scope.openSettingColsDlg = _this.openSettingColsDlg = function () {

      var prevColSettingId = (_this.colSetting && _this.colSetting.user_id) ? _this.colSetting.id : null;

      $uibModal.open({
        templateUrl: 'app/invoices/settings/grid-column.html',
        controller: 'GridColumnCtrl as ctx',
        size: 'vlg',
        backdrop: 'static',
        resolve: {
          key: function () {
            return 'charge_grids_col_defs';
          },
          $me: function () {
            return $me;
          },
          availableGridSettings: function () {
            return _this.availableGridSettings;
          },
          userColSettings: function () {
            return _this.userColSettings;
          },
          colSetting: function () {
            return _this.colSetting;
          },
          selectedCols: function () {
            return _this.selectedCols;
          }
        }
      }).result.then(function (rtr) {
        //$lcmAlert.success('Grid Columns Updated');

        _this.selectedCols = rtr.selectedCols;
        _this.colSetting = rtr.colSetting;
        _this.newColSettingName = _this.colSetting && _this.colSetting.user_id ? _this.colSetting.name : '';
        //update charge grid cols
        _this.applyChargeGridsCols(_this.selectedCols);

        if (prevColSettingId !== _this.colSetting.id) {
          _this.changeColSetting(prevColSettingId);
        }


      }, function () {

      });

    };

    /**
     * Sends reply to note.
     * @param note
     */
    _this.onNoteReply = function (note) {
      Note.create({
        entity_id: _this.invoice.id,
        parent_id: note.id,
        entity_type: 'invoice',
        content: note.$reply.content
      }).then(function (newNote) {
        delete note.$reply;
        note.notes.push(newNote);
      });
    };

    /**
     * Queries charges against query.
     */
    _this.queryCharges = function () {
        GlCodesNonVer.invoiceSummary(_this.invoice.invoice_id).then(function(result){
            _this.glCodeSummary = result.data;
        });
      Charge.findAll({filter: JSON.stringify(_this.chargesQuery)}).then(function (charges) {
        _this.chargesGrid.data = charges;
        _this.ChargesPager.total = charges.$total;
        $timeout(function () {
          restoreSelection(_this.chargesGridApi, _this.selectedCharges);
        }, 50);


      });
    };

    /**
     * Queries invoice and related entities.
     */
    _this.query = function () {


        Invoice.find($stateParams['id']).then(function (invoice) {

            $lcmaPage.setTitle('Invoice Detail: ' + invoice.vendor.name + ' &#9679; ' + invoice.sp_inv_num + ' &#9679; ' + invoice.acct_level_1 + ' &#9679; ' + $filter('lcmaDate')(invoice.due_date));

            _this.invoice = invoice;

            // ensure there is at least 3 rows for contacts
            invoice.contacts = invoice.contacts || [];
            var min = 3;
            if (invoice.contacts.length < min) {
              var count = min - invoice.contacts.length;
              while (count > 0) {
                invoice.contacts.push({cont_type: 'N/A', dummy: true});
                count--;
              }
            }

            /**
             * Update grid data
             */
            _this.chargesQuery = {
              where: {invoice_id: {'==': invoice.invoice_id}},
              limit: _this.ChargesPager.size,
              offset: _this.ChargesPager.from() - 1
            };

            _this.queryCharges();


            // Get notes for the invoice
            _this.notesQuery = {
              where: {
                entity_id: {'==': invoice.id},
                entity_type: {'==': 'invoice'}
              }
            };

            Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
              _this.notes = notes;
            });


            // Get disputes for the invoice
            _this.disputesQuery = {
              where: {
                invoice_id: {'==': invoice.id}
              }
            };

            Dispute.findAll({filter: JSON.stringify(_this.disputesQuery)}).then(function (disputes) {

              _this.invoice.amount_witheld = 0;
              angular.forEach(disputes, function (x) {

                var amt = parseFloat(x.amount_withheld);

                _this.invoice.amount_witheld += !isNaN(amt) ? amt : 0;
              });

              _this.disputesGrid.data = disputes;
            });

            //prepare the SubAccounts grid
            _this.subaccountQuery = {
                where: {
                    invoice_id: {'==': _this.invoice.invoice_id},
                    acct_level: {'==': 2}
                },
                orderBy: [['acct_level_2', 'ASC']]
            };

            Invoice.findAll({filter: JSON.stringify(_this.subaccountQuery)})
                .then(function (data) {
                    _this.subAccountsGrid.data = data;
                });

        });



    };

    /**
     * Calculate the grid height based on selected rows.
     */
    _this.getGridHeight = function () {

      var rowHeight = 25; // your row height
      var headerHeight = 28; // your header height
      var footerHeight = 30;
      var scrollbarHeight = 26;


      return {
        height: (_this.ChargesPager.size * rowHeight + headerHeight + footerHeight + scrollbarHeight) + "px"
      };


    };

    this.query();
    if (chargeId) {
        var q = {where:
                    {id: {'===': chargeId}}
        };
        Charge.findAll({filter: JSON.stringify(q)}).then(function (obj) {
            _this.chargesSelectionGrid.data = obj;
        });
    }

  });
