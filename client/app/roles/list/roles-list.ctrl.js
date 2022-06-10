'use strict';

angular.module('lcma')
    .controller('RolesCtrl', function ($scope, $timeout, $roles, $lcmaGrid, $lcmaPager, $lcmaPage, $lcmaGridFilter, $uibModal, uiGridConstants, $lcmAlert, $lcmaDialog, $lcmaConfirmation, Role, UserSettingsService) {

        $lcmaPage.setTitle('Roles');

        $lcmaConfirmation.setFormId('RoleForm');
        $lcmaConfirmation.setFormName('RoleForm');

        var _this = this,
        settings_id = 'roles_list_layout';

        _this.data = [];
        _this.currentSelection = {};

        _this.layout = {
            orientation: 'horizontal',
            pane1: {
                size: 25
            },
            details: {
                pane2: 75
            }
        };

        _this.onLayoutChange = function (settings) {
          // TODO: Save settings
          /* angular.extend(_this.layout, settings);
           SettingsService.save({
           key: 'roles.list.layout',
           value: _this.layout
           })*/
        };


        var rolesLcmaGrid = $lcmaGrid({
            exporterCsvFilename: 'roles.csv',
            settingKey: 'roles.list.grid',
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            onRegisterApi: function (api) {

                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                  _this.roleQuery.orderBy = columns.map(function (x) {
                    return [x.field, x.sort.direction.toUpperCase()];
                  });

                  _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                  $lcmaGridFilter(this.grid, _this.roleQuery)
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
            .addColumn('name', 'Name', {width: '*'})
            .addNumberColumn('user_in_roles.length', 'No of Users', {
                enableFiltering: false
            });

        var grid = _this.gridOptions = rolesLcmaGrid.options();

        /**
         * Fires on settings update.
         * @param settings
         */
        _this.onSettingsUpdate = function (settings) {
          rolesLcmaGrid.updateFromSettings(settings, _this.gridApi);
        };

        /**
         * Opens add role dialog
         */
        _this.addRole = function () {

            var form = document.getElementById($lcmaConfirmation.getFormName());
            var formScope = angular.element(form).scope();

            if (formScope && formScope[$lcmaConfirmation.getFormName()].$dirty) {

                $lcmaDialog.confirm({
                    titleText: 'Please confirm',
                    bodyText: 'You have unsaved changes. Are you sure you want to leave this page?'
                })
                    .result.then(function (res) {
                        $lcmaConfirmation.resetFieldsStyle();
                        _this.currentSelection = null;
                        _this.gridApi.selection.clearSelectedRows();
                        // update form name/id

                        $lcmaConfirmation.setFormId('RoleForm');
                        $lcmaConfirmation.setFormName('RoleForm');



                    }, function (error) {
                        $lcmaConfirmation.markDirtyFields();

                    });

                // update the selection should be fired inside confirmation dialog box
                return;
            }

            _this.currentSelection = null;
            _this.gridApi.selection.clearSelectedRows();

            // update form name/id

            $lcmaConfirmation.setFormId('RoleForm');
            $lcmaConfirmation.setFormName('RoleForm');


        };

        $scope.resolvesNew = {
        $roles: $roles
        };

        _this.updateRole = function (role, form) {
          if (!form.$valid) {
            return;
          }
          Role.update(role.id, {
            id: role.id,
            name: role.name
          }).then(function (role) {
            angular.extend(_this.currentSelection, role);
            $lcmAlert.success('Role info successfully updated');
          });
        };

        _this.editPermission = function (permission, role) {

          permission.role = role;

          $uibModal.open({
              templateUrl: 'app/permissions/edit/permissions-edit.html',
              controller: 'PermissionEditCtrl',
              windowClass: 'app-modal-window',
              backdrop: 'static',
              resolve: {
                $currentPermission: function () {
                  return permission;
                }
              }
            })
            .result.then(function (data) {
            _this.refresh();
            $lcmAlert.success('Permission has been updated');
          });

        };

        /**
         * return object for permission edit
         * @param permission
         * @param role
         */
        _this.resolvesEditPermission = function (permission, role) {
          permission.role = role;
          return {
            '$currentPermission': permission
          };
        };

        $scope.removeRole = _this.removeRole = function (role, index) {
            $lcmaDialog.confirm({
                titleText: 'Please confirm',
                bodyText: 'Are you sure you want to permanently remove this role?'
            }).result.then(function () {
                role.$deleted = true;
                _this.currentSelection = _this.data[0];
                Role.destroy(role.id)
                    .then(function(result) {
                        $lcmaConfirmation.resetFieldsStyle();
                    })
            });
        };

        /**
         * Opens edit role dialog
         */
        $scope.editRole = _this.editRole = function (role) {

          $uibModal.open({
            templateUrl: 'app/roles/edit/role-edit.html',
            controller: 'RoleEditCtrl',
            size: "sm",
            backdrop: 'static',
            resolve: {
              $currentRole: function () {
                return role;
              },
              $roles: function () {
                return $roles;
              }

            }
          }).result.then(function (roleUpdate) {
            angular.extend(role, roleUpdate);
            $lcmAlert.success('Role has been updated');
          });

        };

        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
          onGo: function () {
            _this.roleQuery.limit = _this.pager.size;
            _this.roleQuery.offset = _this.pager.from() - 1;
            _this.refresh();
          }
        });


        /**
         * Holds role query.
         */
        _this.roleQuery = {
          where: {},
          limit: _this.pager.size,
          offset: this.pager.from() - 1,
          orderBy: [['name', 'ASC']]
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
                        _this.newItem = false;
                        _this.currentSelection = item;
                        _this.currentSelectionCopy = angular.copy(item);

                        // update form name/id
                        if (item === null ) {
                            $lcmaConfirmation.setFormId('RoleForm');
                            $lcmaConfirmation.setFormName('RoleForm');
                        }
                        else {
                            $lcmaConfirmation.setFormId('RoleEditForm');
                            $lcmaConfirmation.setFormName('RoleEditForm');
                        }

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


            _this.newItem = false;
            _this.currentSelection = item;
            _this.currentSelectionCopy = angular.copy(item);

            // update form name/id
            if (item === null ) {
                $lcmaConfirmation.setFormId('RoleForm');
                $lcmaConfirmation.setFormName('RoleForm');
            }
            else {
                $lcmaConfirmation.setFormId('RoleEditForm');
                $lcmaConfirmation.setFormName('RoleEditForm');
            }

        };

        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
          _this.roleQuery.where = {};
          _this.gridApi.core.clearAllFilters(true, true, true);
          _this.refresh();
        };

        //Discard content and reload original one
        _this.onDismiss = function (create) {
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
        _this.onChange = function (data, create) {
            if (create) {
                grid.data.push(data);
                _this.currentSelection = data;
                $timeout(function () {
                    //_this.gridApi.selection.selectRow(grid.data[0]);
                    _this.gridApi.selection.selectRow(data); //select newly created data
                });
                $lcmAlert.success('New Role has been created');
            }
            else {
                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    selectedRows[0] = data;
                }
                $lcmAlert.success('Role has been updated');
            }
            $lcmaConfirmation.resetFieldsStyle();
        };


        _this.refresh = function () {

          _this.roleQuery.where.time = new Date().getMilliseconds();
          Role.findAll({filter: JSON.stringify(_this.roleQuery)}, {bypassCache: true})
            .then(function (data) {
              _this.data = data;

              grid.data = data;
              _this.pager.total = data.$total;


              // select first immediately
              if (data.length) {
                $timeout(function () {
                  _this.select(data[0]);
                  _this.gridApi.selection.toggleRowSelection(grid.data[0]);
                })
              }


            });
        };

        _this.checkDisabled = function () {
          var t = _this.gridApi.selection.getSelectedRows();
          if (t[0]) {
            return t[0].user_in_roles.length > 0;
          } else {
            return true;
          }

        };

        $scope.removeRole = _this.removeRole = function (role, index) {
          if (_this.checkDisabled())
            return;
          var role = _this.gridApi.selection.getSelectedRows()[0];
          $lcmaDialog.remove({
            message: ' Role ' + role.name
          }).result.then(function () {
            role.$deleted = true;
            _this.currentSelection = _this.data[0];
            Role.destroy(role.id);
          });
        };

    _this.refresh();

  });
