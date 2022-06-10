'use strict';

angular.module('lcma')
    .controller('AccountShowCtrl', function ($scope, $state, $timeout, $lcmAlert, $stateParams, $lcmaGrid, $lcmaGridFilter, $lcmaPage, $lcmaDialog,AccountStatus, $uibModal, $lcmaConfirmation, Account, Invoice, invoiceService, History, Note) {

        $lcmaPage.setTitle('Accounts');

        $lcmaConfirmation.setFormId('AccountForm');
        $lcmaConfirmation.setFormName('AccountForm');

        var _this = this;
        AccountStatus.findAll().then(function (statuses) {
            $scope.statuses = statuses;
        });

        /**
         * Holds invoice query.
         */
        _this.invoiceQuery = {
          where: {}
        };

        /**
         * Holds invoice grid settings
         * @type {{}}
         */
        var invoicesGrid = _this.invoicesGrid = $lcmaGrid({
          exporterCsvFilename: 'invoices.csv',
          onRegisterApi: function (api) {

            _this.gridApi = api;

            api.core.on.sortChanged($scope, function (grid, columns) {
              _this.invoiceQuery.orderBy = columns.map(function (x) {
                return [x.field, x.sort.direction.toUpperCase()];
              });

              _this.refreshInvoices();
            });

            api.core.on.filterChanged($scope, function (x) {

               $lcmaGridFilter(this.grid, _this.invoiceQuery)
                .applyAll(invoicesGrid.columnDefs.filter(function (x) {
                  return x.enableFiltering;
                }));

              _this.refreshInvoices();

            });
          }
        })
          .addColumn('sp_inv_num', 'Invoice Number', {
            width: 150,
            pinnedLeft: true,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="app.invoiceDetails({id: row.entity.id})">{{row.entity.sp_inv_num}}</a></div>',
          })
          .addDateColumn('inv_date', 'Invoice Date')
          .addDateColumn('due_date', 'Due Date')
          .addStatusColumn('sp_acct_status_ind', 'Status', {
            cellTemplate: '<div class="ui-grid-cell-contents"><lcma-invoice-status-view ng-model="row.entity.sp_acct_status_ind"></lcma-invoice-status-view></div>',
            filter: {
              term: -1,
              selectOptions: invoiceService.getFilters()
            }
          })
        .addCurrencyColumn('prev_bill_amt', 'Prior Bill Amount')
        .addCurrencyColumn('pmts_rcvd', 'Payments Received ')
        .addCurrencyColumn('bal_fwd_adj', 'Bal Forward Adjs')
        .addCurrencyColumn('bal_fwd', 'Balance Forward')
        .addCurrencyColumn('tot_mrc_chgs', 'Total MRCs')
        .addCurrencyColumn('tot_occ_chgs', 'Total OCCs')
        .addCurrencyColumn('tot_usage_chgs', 'Total Usage')
        .addCurrencyColumn('prev_bill_amt', 'Prior Bill Amount')
        .addCurrencyColumn('tot_taxsur', 'Total Tax & Surcharges')
        .addCurrencyColumn('tot_disc_amt', 'Total Discounts ')
        .addCurrencyColumn('tot_new_chg_adj', 'Total New Charge Adjs ')
        .addCurrencyColumn('tot_new_chgs', 'Total New Charges')
        .addCurrencyColumn('tot_amt_due_adj', 'Total Amount Due Adj ')
        .addCurrencyColumn('prev_bill_amt', 'Prior Bill Amount')
        .addCurrencyColumn('tot_amt_due', 'Total Amount Due')
          .options();

        /**
         * Initiates deletion of an account
         */
        /*_this.deleteAccount = function () {
          $lcmaDialog.confirm({
            titleText: 'Please confirm',
            bodyText: 'Are you sure you want to permanently remove this account?'
          }).result.then(function () {
            //grid.data.splice(index, 1);
            Account.destroy(_this.account.id);
            $state.go('app.accounts');
          });
        };*/


        /**
         * Opens add account dialog
         */
       /* _this.editAccount = function () {

          $uibModal.open({
            templateUrl: 'app/accounts/edit/account-edit.html',
            controller: 'AccountEditCtrl',
            resolve: {
              account: function () {
                return _this.account;
              }
            }
          }).result.then(function (acc) {
            angular.extend(_this.account, acc);
            $lcmAlert.success('Account has been updated');
          });

        };*/

        _this.changeStatus = function(){
             var t = _this.account_status_id?3:4;
            Account.updateStatus(_this.account.id, {data:{status_id:t}}).then(function (acc) {
              _this.account.status_id = t;
              $lcmAlert.success('Account status has been updated successfully.');
            });
        };

        _this.saveAccount = function (form) {
            form.$setSubmitted();
            if(!form.$valid) {
              return;
            }

            Account.update(_this.account.id, _this.account).then(function (acc) {
                $lcmaConfirmation.resetFieldsStyle();
                $lcmAlert.success('Account has been updated successfully.');
            });


        };

        /**
         * Clears all invoice filters.
         */
        _this.clearInvoicesFilters = function () {
          _this.gridApi.core.clearAllFilters(true, true, true);

          _this.refreshInvoices();
        };

        /**
         * Queries account and related entities.
         */
        _this.query = function () {
          Account.find($stateParams['id']).then(function (account) {

            $lcmaPage.setTitle('Account: ' + account.account_no);

            _this.account = account;
            _this.account_status_id = _this.account.status_id==3;

            _this.invoiceQuery = {
                where: {
                    acct_level_1: {
                      '===' : _this.account.account_no
                    }
                },
                orderBy:[
                    ['inv_date', 'desc']
                ]
            };

            _this.refreshInvoices();
          });
        };

        /**
         * Refreshes list of account invoices.
         */
        _this.refreshInvoices = function () {
            _this.invoiceQuery.where.acct_level_1 = {
                    '===' : _this.account.account_no
              };
          Invoice.findAll({filter: JSON.stringify(_this.invoiceQuery)})
            .then(function (invoices) {
              invoicesGrid.data = invoices;
            });
        };


        _this.query();


        /*
         * notes and history
         */
        _this.history=[];

        _this.activateNotesTab = function() {
          //_this.queryHistory();
        };

        _this.historyQuery = {
            where: {
              entity_type : {'==':"account"},
              entity_id: {'==': $stateParams['id']}
            }
        };

        History.findAll({filter: JSON.stringify(_this.historyQuery)}).then(function (history) {
            _this.history = history;
        });


         /**
         * Holds list of contract notes.
         */
        _this.notes = [];

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
                return _this.account.id;
              },
              entityType: function () {
                return 'account';
              },
              charges: function () {
                return [];
              }
            }
          }).result.then(function (newNote) {
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
            entity_id: _this.account.id,
            parent_id: note.id,
            entity_type: 'account',
            content: note.$reply.content
          }).then(function (newNote) {
            delete note.$reply;
            if(!note.notes) note.notes = [];
            note.notes.push(newNote);
          });
        };

        _this.notesQuery = {
            where: {
              entity_id: {'==': $stateParams['id']},
              entity_type: {'==': 'account'}
            }
        };

        Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
            _this.notes = notes;

        });


  });
