/**
 *
 */
(function () {
    'use strict';

    function PermissionListCtrl($scope, $modules, $roles, $lcmAlert, $lcmaPage, $lcmaDialog, $lcmaGrid, $lcmaPager, $lcmaGridFilter, $uibModal, $lcmaConfirmation, $timeout, Permission, Role) {

        $lcmaPage.setTitle('Permissions');

        $lcmaConfirmation.setFormId('permissionForm');
        $lcmaConfirmation.setFormName('permissionForm');

        var _this = this;

        _this.modules = $modules;
        _this.currentSelection = {};

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
                       _this.editPermission(item);
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

           _this.editPermission(item);
           _this.currentSelection = item;
       };

        _this.onSettingsUpdate = function (settings) {
            permissionsGrid.updateFromSettings(settings, _this.gridApi);
        };
        /**
         * Permissions grid definition
         */
        var permissionsGrid = $lcmaGrid({
            exporterCsvFilename: 'permissions.csv',
            settingKey: 'permissions.list.grid',
            enableFiltering: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            enableSorting: true,
            onRegisterApi: function (api) {

                _this.gridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.permissionQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                    _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.permissionQuery)
                        .applyAll(grid.columnDefs.filter(function (x) {
                            return x.enableFiltering;
                        }));

                    _this.refresh();
                });

                api.selection.on.rowSelectionChanged($scope, function (row) {
                    if (!_this.currentSelection || _this.currentSelection.id !== row.entity.id) {
                        _this.select(row.entity);
                    }
                });

            }

        })
            .addRelColumn('role_id', "Role", {
                width: 180,
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.role.name}}</div>',
                filter: {
                    term: -1,
                    selectOptions: Role.findAll(),
                    map: function (m) {
                        return {
                            value: m.id,
                            label: m.name
                        };
                    }
                }
            })
            .addRelColumn('module_id', "Module", {
                width: 180,
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.module.title}}</div>',
                filter: {
                    term: -1,
                    selectOptions: $modules.map(function (m) {
                        return {
                            value: m.key,
                            label: m.title
                        }
                    })
                }
            })
            .addColumn('actions', "Action", {
                enableFiltering: false,
                enableSorting: false,
                width: 350,
                cellTemplate: '<div class="ui-grid-cell-contents"><span class="badge" style="margin-right: 5px;" ng-repeat="action in row.entity.actions">{{action.name}}</span></div>'
            })
            .addColumn('filters', "Filters", {
                enableFiltering: false,
                enableSorting: false,
                width: 350,
                cellTemplate: '<div class="ui-grid-cell-contents"><span class="badge" style="margin-right: 5px;" ng-repeat="filter in row.entity.filters">{{filter.title}}</span></div>'
            });
        var grid = _this.gridOptions =  permissionsGrid.options();


        /**
         * Initiates Permission remove.
         */
        $scope.removePermission = _this.remove = function () {
            if(_this.gridApi.selection.getSelectedRows().length===0) return;
            var permission = _this.gridApi.selection.getSelectedRows()[0];

            $lcmaDialog.remove({
               message:' permissions for module '+permission.module.title + ' and role ' + permission.role.name
            }).result.then(function () {
                Permission.destroy(permission.id).then(function(){
                    $lcmaConfirmation.resetFieldsStyle();
                    $lcmAlert.success('Permission has been deleted');
                });
            });
        };

        /**
         * Opens view permission dialog
         */
        $scope.editPermission = _this.editPermission = function (permission) {
             $scope.resolvesEdit = {
                $currentPermission: permission
            };
        };

        $scope.resolvesNew = {
                $modules: $modules,
                $roles: $roles
            };

        /**
         * Opens view permission dialog
         */
        $scope.addPermission = _this.addPermission = function () {

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

            _this.gridApi.selection.clearSelectedRows();
            _this.currentSelection = null;
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
                $lcmAlert.success('New Permission has been created');
            }
            else {
                var selectedRows = _this.gridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                    selectedRows[0] = data;
                }
                $lcmAlert.success('Permission has been updated');
            }
        };

        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
            _this.permissionQuery.where = {};
            _this.gridApi.core.clearAllFilters(true, true, true);
            _this.refresh();
        };


        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
            onGo: function () {
                _this.permissionQuery.limit = _this.pager.size;
                _this.permissionQuery.offset = _this.pager.from() - 1;
                _this.refresh();
            }
        });


        /**
         * Holds invoice query.
         */
        _this.permissionQuery = {
          where: {},
          limit: _this.pager.size,
          offset: _this.pager.from() - 1,
          orderBy: [['role_id', 'ASC'], ['module_id', 'ASC']]
        };

        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
            _this.permissionQuery.where = {};
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
         * Selects current module.
         * @param module
         */
        _this.selectModule = function (module) {
            if (module !== _this.selectedModule) {
                _this.selectedModule = module;
                module
                    ? _this.permissionQuery.where["module_id"] = {'===': module.key}
                    : delete _this.permissionQuery.where["module_id"];

                _this.refresh();
            }
        };


        /**
         * Refreshes data against query.
         */
        _this.refresh = function () {

            return Permission.findAll({filter: JSON.stringify(_this.permissionQuery)},{ bypassCache: true })
                .then(function (data) {
                    grid.data = data;
                    _this.pager.total = data.$total;
                    if (data.length && _this.gridApi) {
                        $timeout(function () {
                            _this.select(data[0]);
                            _this.gridApi.selection.toggleRowSelection(grid.data[0]);
                        });
                    }

                    return data;
                });
        };

        _this.refresh();

    }

    angular.module('lcma')
        .controller('PermissionListCtrl', PermissionListCtrl);


}());
