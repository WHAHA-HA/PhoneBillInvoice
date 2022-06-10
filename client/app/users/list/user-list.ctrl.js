'use strict';

angular.module('lcma')
    .controller('UsersCtrl', function ($scope, $roles, $timeout, $lcmaGrid, $lcmaPager, $lcmaPage, $lcmaGridFilter, $uibModal, $lcmAlert, $lcmaConfirmation, $lcmaDialog, User) {

        $lcmaPage.setTitle('User List');

        $lcmaConfirmation.setFormId('UserForm');
        $lcmaConfirmation.setFormName('UserForm');

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
                        _this.editUser(item);
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

            _this.editUser(item);
            _this.currentSelection = item;
        };

        _this.onSettingsUpdate = function (settings) {
            userGrid.updateFromSettings(settings, _this.gridApi);
        };

        var userGrid = $lcmaGrid({
            exporterCsvFilename: 'users.csv',
            enableRowSelection: true,
            settingKey: 'user.list.grid',
            enableRowHeaderSelection: false,
            multiSelect: false,
            onRegisterApi: function (api) {

                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.userQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                    _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.userQuery)
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
            /*.addCommandColumn('edit', ' ', {
             cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editUser(row.entity)"><i class="fa fa-pencil"></i></a>'
             })*/
            /*      .addCommandColumn('remove', 'remove', {
             cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeUser(row.entity, $index)"><i class="fa fa-trash"></i></a>',

             })*/
            .addColumn('username', 'Username')
            .addColumn('last_name', 'Last Name')
            .addColumn('first_name', 'First Name')
            .addColumn('email', 'Email')
            .addColumn('mobile_number', 'Mobile Number')
            .addBooleanColumn('is_active', 'Active', {width: 50})
            .addRelColumn('roles', "Roles", {
                enableFiltering: true,
                width: '*',
                cellTemplate: '<div class="ui-grid-cell-contents"><span class="badge" style="margin-right: 5px;" ng-repeat="role in row.entity.roles">{{role.name}}</span></div>',
                filter: {
                    term: -1,
                    warning: 'Applying this filter will disable other filters',
                    selectOptions: $roles.map(function (m) {
                        return {
                            value: m.id,
                            label: m.name
                        }
                    })
                }
            });
        var grid = _this.gridOptions = userGrid.options();

        /**
         * Opens add user dialog
         */
        _this.addUser = function () {

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

        $scope.resolvesNew = {
            $roles: $roles
        };
        /**
         * Opens edit user dialog
         */
        $scope.editUser = _this.editUser = function (user) {
          _this.resolvesEdit = {
            userId: user.id,
            $roles: $roles,
            avatar: user.avatar,
            defaultOption: true
          };
        };


        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
            onGo: function () {
                _this.userQuery.limit = _this.pager.size;
                _this.userQuery.offset = _this.pager.from() - 1;
                _this.refresh();
            }
        });


        /**
         * Holds user query.
         */
        _this.userQuery = {
            where: {},
            limit: _this.pager.size,
            offset: this.pager.from() - 1,
            orderBy: [['last_name', 'ASC'], ['first_name', 'ASC']]
        };


        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
            _this.userQuery.where = {};
            _this.gridApi.core.clearAllFilters(true, true, true);
            _this.refresh();
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

                $lcmAlert.success('New User has been created');
            }
            else {
                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    selectedRows[0] = data;
                }
                $lcmAlert.success('User has been updated');
            }
            $lcmaConfirmation.resetFieldsStyle();
        };

        _this.refresh = function () {
          User.findAll({filter: JSON.stringify(_this.userQuery)}, {bypassCache: true})
            .then(function (data) {
                grid.data = data;
                _this.pager.total = data.$total;


                if (data.length  && _this.gridApi) {
                    $timeout(function () {
                      _this.select(data[0]);
                      _this.gridApi.selection.toggleRowSelection(grid.data[0]);
                    });
                }
            });
        };

        _this.refresh();

    });
