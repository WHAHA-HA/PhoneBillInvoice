'use strict';

angular.module('lcma')
    .controller('DictionaryCtrl', function ($scope, uiGridConstants, $lcmAlert, $uibModal, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter,
                                          Dictionary, DictionaryGroup, $timeout, $lcmaConfirmation, $lcmaDialog) {

        $lcmaPage.setTitle('Dictionary List');

        $lcmaConfirmation.setFormId('DictionaryForm');
        $lcmaConfirmation.setFormName('DictionaryForm');

        var _this = this;
        _this.currentSelection = {};

        _this.layout = {
          orientation: 'horizontal',
          list: {
            size: 50
          },
          details: {
            size: 50
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
                        _this.editDictionary(item);
                        _this.currentSelection = item;

                    }, function(error) {

                        //select previous item in the grid
                        if (!_this.currentSelection) {
                            _this.dictionaryGridApi.selection.clearSelectedRows();
                        }
                        else {
                            _this.dictionaryGridApi.selection.selectRow(_this.currentSelection);
                        }

                        $lcmaConfirmation.markDirtyFields();

                    });

                // update the selection should be fired inside confirmation dialog box
                return;

            }

            _this.editDictionary(item);
            _this.currentSelection = item;
        };

        _this.onSettingsUpdate = function (settings) {
            lcmaGrid.updateFromSettings(settings, _this.dictionaryGridApi);
        };

        /**
         * Holds grid settings
         * @type {settings}
         */
        var lcmaGrid = $lcmaGrid({
            exporterCsvFilename: 'dictionary.csv',
            settingKey: 'dictionary.list.grid',
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            onRegisterApi: function (api) {
                _this.dictionaryGridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                  _this.query.orderBy = columns.map(function (x) {
                    return [x.field, x.sort.direction.toUpperCase()];
                  });

                  _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                  $lcmaGridFilter(this.grid, _this.query).applyAll(grid.columnDefs.filter(function (x) {
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
            .addCommandColumn('edit', ' ', {
                cellTemplate: '' +
                '<a ng-hide="row.treeLevel==0" class="ui-grid-cell-contents" ng-click="grid.appScope.editDictionary(row.entity)"><i class="fa fa-pencil"></i></a>' +
                '<a ng-hide="row.treeLevel!=0" class="ui-grid-cell-contents" ng-click="grid.appScope.orderItem(grid.appScope.getLabel(row))"><i class="fa fa-sort"></i></a>'
                ,
            })
            .addColumn('key', 'Key', {
                enableFiltering:false
            })
            .addColumn('value', 'Value', {
                enableFiltering:false
            })
            .addColumn('group', 'Group', {
                grouping: {groupPriority: 0},
                width: '*',
                cellTemplate: '<div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )"  class="ui-grid-cell-contents">{{COL_FIELD CUSTOM_FILTERS}}</div>\n\
                                <a ng-if="col.grouping && col.grouping.groupPriority !== undefined && col.grouping.groupPriority !== null && ( !row.groupHeader || col.grouping.groupPriority !== row.treeLevel )"  class="ui-grid-cell-contents" ng-click="grid.appScope.orderItem(row.entity.group)">{{row.entity.group}}</a>'

                /* filter: {
                 term: -1,
                 type: uiGridConstants.filter.SELECT,
                 selectOptions: DictionaryGroup.all(),
                 map: function(x){
                 return {value: x, label: x};
                 }
                 }*/
            });

        var grid = _this.dictionaryGrid = lcmaGrid.options();

        $scope.getLabel = function (row) {
            var label = "";
            for (var i in row.entity)
                label = row.entity[i].groupVal;
            return label;
        };

        /**
         * Initiates dialog for dictionary edit.
         */
        $scope.editDictionary = _this.editDictionary = function (dictionary) {
            $scope.resolvesEdit = {
                dictionary: dictionary
            };
        };

        $scope.orderItem = _this.orderItem = function (group) {
          $uibModal.open({
            templateUrl: 'app/dictionary/group/dictionary-group.html',
            controller: 'DictionaryGroupCtrl',
            backdrop: 'static',
            size: 'sm',
            resolve: {
              group: function () {
                return group;
              }
            }
          }).result.then(function () {
            $lcmAlert.success('Dictionary data has been updated');
          });
        };

        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
          size: 100,
          onGo: function () {
            _this.query.limit = _this.pager.size;
            _this.query.offset = _this.pager.from() - 1;
            _this.refresh();
          }
        });

        /**
         * Holds query.
         */
        _this.query = {
          where: {},
          limit: _this.pager.size,
          offset: _this.pager.from() - 1,
          orderBy: [['group', 'ASC']]
        };
        //_this.query.orderBy = "group";


        $scope.resolvesNew = {};

        _this.newDictionary = function () {

            var form = document.getElementById($lcmaConfirmation.getFormName());
            var formScope = angular.element(form).scope();

            if (formScope && formScope[$lcmaConfirmation.getFormName()].$dirty) {

                $lcmaDialog.confirm({
                    titleText: 'Please confirm',
                    bodyText: 'You have unsaved changes. Are you sure you want to leave this page?'
                })
                    .result.then(function(res) {
                        $lcmaConfirmation.resetFieldsStyle();
                        _this.dictionaryGridApi.selection.clearSelectedRows();
                        _this.currentSelection = null;

                    }, function(error) {
                        $lcmaConfirmation.markDirtyFields();

                    });

                // update the selection should be fired inside confirmation dialog box
                return;
            }

            _this.dictionaryGridApi.selection.clearSelectedRows();
            _this.currentSelection = null;
        };

        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
          _this.query.where = {};
          _this.dictionaryGridApi.core.clearAllFilters(true, true, true);
          _this.refresh();
        };


        /**
         * Initiates export to CSV action.
         */
        _this.exportToCSV = function () {

          var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
          _this.dictionaryGridApi.exporter.csvExport('all', 'all', myElement);

        };

        //Discard content and reload original one
        _this.onDismiss = function (create) {
            $lcmaConfirmation.resetFieldsStyle();
            if (create) {
                return;
            }
            var selectedRows = _this.dictionaryGridApi.selection.getSelectedRows();
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
                    _this.dictionaryGridApi.selection.selectRow(data); //select newly created data
                });
                $lcmAlert.success('New Permission has been created');
            }
            else {
                var selectedRows = _this.dictionaryGridApi.selection.getSelectedRows();
                if (selectedRows.length > 0) {
                  selectedRows[0] = data;
                }
                $lcmAlert.success('Permission has been updated');
            }
            $lcmaConfirmation.resetFieldsStyle();
        };



        /**
         * Refreshes data against query.
         */
        _this.refresh = function () {

          _this.query.where['id'] = {'>': -(new Date().getMilliseconds())};
          return Dictionary.findAll({filter: JSON.stringify(_this.query)}, {bypassCache: true})
            .then(function (data) {
              _this.pager.total = data.$total;
              grid.data = data;
              if (data.length && _this.dictionaryGridApi) {
                $timeout(function () {
                  _this.select(data[0]);
                  _this.dictionaryGridApi.selection.toggleRowSelection(grid.data[0]);
                });
              }

              return data;
            });
        };

        _this.refresh();

  });
