'use strict';

angular.module('lcma')
    .controller('AccountsCtrl', function ($scope, $state, $location, $lcmAlert, $uibModal, $lcmaDialog, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, invoiceService, Account, uiGridConstants, Vendor, AccountStatus) {

        $lcmaPage.setTitle('Account List');
        $scope.showAdd = $state.current.data.showAdd;
        var _this = this;
        $scope.accountStatuses = [];
        AccountStatus.findAll().then(function(data){
            $scope.accountStatuses = data;
        });
        $scope.onSettingsUpdate = function (settings) {
            lcmaGrid.updateFromSettings(settings, _this.accountsGridApi);
        };
        /**
         * Holds grid settings
         * @type {settings}
         */
        var lcmaGrid = $lcmaGrid({
            exporterCsvFilename: 'accounts.csv',
            settingKey: 'accounts.list.grid',
            exporterFieldCallback: function (grid, row, col, value) {
                if (col.field === 'status_id') {
                    value = row.entity.status.value;
                }

                return value ? value.toString() : null;
            },
            onRegisterApi: function (api) {
                _this.accountsGridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.accountQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                    _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.accountQuery)
                        .applyAll(grid.columnDefs.filter(function (x) {
                            return x.enableFiltering;
                        }));

                    _this.refresh();

                });
            },
            exporterFieldCallback: function( grid, row, col, input ) {

                if (col.field==='status_id') {
                    return row.entity.status ? row.entity.status.value : '';
                }
                else if (col.field==='vendor_id') {
                    return row.entity.vendor ? row.entity.vendor.name : '';
                }


                return input;

            },
        })
            .addColumn('account_no', 'Account', {
                cellTemplate: '<div  class="ui-grid-cell-contents"><a ui-sref="app.accountDetails({id: row.entity.id})">{{row.entity.account_no}}</a></div>',
            })
            .addRelColumn('status_id', 'Status', {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status.value}}</div>',
                width: 120,
                filter: {
                    term: -1,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: AccountStatus.findAll(),
                    map: function (x) {
                        return {value: x.key, label: x.value}
                    }
                }
            })
            .addRelColumn('vendor.name', "Vendor", {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.vendor.name}}</div>',
                width: 120,
                filter: {
                    term: -1,
                    nulls : true,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: Vendor.findAll(),
                    map: function (x) {
                        return {value: x.name, label: x.name}
                    }
                }
            })
            .addColumn('ap_vend_id', 'AP Vendor ID', {width: 120})
            .addNumberColumn('billing_cycle', 'Billing Cycle')
            .addColumn('vendor_alias', 'Vendor Alias', {width: 100})
            .addColumn('late_bill_log_days', 'Late Bill Log', {width: 100});
            var grid = _this.accountsGrid = lcmaGrid.options();


        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
            onGo: function () {
                _this.accountQuery.limit = _this.pager.size;
                _this.accountQuery.offset = _this.pager.from() - 1;
                _this.refresh();
            }
        });

        /**
         * Holds invoice query.
         */
        _this.accountQuery = {
          where: {},
          limit: _this.pager.size,
          offset: this.pager.from() - 1,
          orderBy: [['account_no', 'ASC']]
        };


        /**
         * Initiates deletion of an account
         */
        $scope.removeAccount = _this.removeAccount = function (account) {
            $lcmaDialog.confirm({
                titleText: 'Please confirm',
                bodyText: 'Are you sure you want to permanently remove this account?'
            }).result.then(function () {
                //grid.data.splice(index, 1);
                Account.destroy(account.id);
            });
        };


        /**
         * Opens add account dialog
         */
        _this.editAccount = $scope.editAccount = function (account) {

            $uibModal.open({
              templateUrl: 'app/accounts/edit/account-edit.html',
              controller: 'AccountEditCtrl',
              backdrop: 'static',
              resolve: {
                  account: function () {
                      return account;
                  }
              }
            }).result.then(function (acc) {
              angular.extend(account, acc);
              $lcmAlert.success('Account has been updated');
            });

        };


        /**
         * Opens add account dialog
         */
        _this.newAccount = function () {

          $uibModal.open({
            templateUrl: 'app/accounts/new/account-new.html',
            controller: 'AccountNewCtrl',
            backdrop: 'static'
          }).result.then(function (account) {
            grid.data.push(account);
            $lcmAlert.success('Account has been created');
          }, function () {


          });

        };

        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
            _this.accountQuery.where = {};
            _this.accountsGridApi.core.clearAllFilters(true, true, true);
            _this.refresh();
        };


        /**
         * Initiates export to CSV action.
         */
        _this.exportToCSV = function () {

            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            _this.accountsGridApi.exporter.csvExport('all', 'all', myElement);

        };

        /**
         * Refreshes data against query.
         */
        _this.refresh = function () {
            return Account.findAll({filter: JSON.stringify(_this.accountQuery)})
                .then(function (data) {
                    grid.data = data;
                    _this.pager.total = data.$total;
                    return data;
                });
        };

        _this.refresh();
    });
