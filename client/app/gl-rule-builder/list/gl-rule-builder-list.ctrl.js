'use strict';

angular.module('lcma')
        .controller('GlRuleBuilderListCtrl', function ($scope, $location, $lcmAlert, $state, GlCodeSegments, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, $lcmaDialog, $timeout, GlRules) {

            $lcmaPage.setTitle('GL Rules');

            var _this = this;

            _this.layout = {
                orientation: 'horizontal',
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
             * Holds grid settings
             * @type {settings}
             */
            var grid = _this.rulesGrid = $lcmaGrid({
                exporterCsvFilename: 'GL_rules.csv',
                multiSelect: false,
                noUnselect: true,
                onRegisterApi: function (api) {
                    _this.gridApi = api;

                    api.core.on.sortChanged($scope, function (grid, columns) {
                        _this.query.orderBy = columns.map(function (x) {
                            return [x.field, x.sort.direction.toUpperCase()];
                        });

                        _this.refresh();
                    });

                    api.core.on.filterChanged($scope, function (x) {

                        $lcmaGridFilter(this.grid, _this.query)
                                .applyAll(grid.columnDefs.filter(function (x) {
                                    return x.enableFiltering;
                                }));

                        _this.refresh();

                    });

                    api.selection.on.rowSelectionChanged($scope, function (row) {
                        _this.select(row.entity);
                    });

                }
            })
                    .addColumn('rule_name', 'Name')
                    .addColumn('rule_desc', 'Description', {width: 250})
                    .options();

            /**
             * Initiates remove.
             */
            $scope.removeRule = _this.removeRule = function () {
                if (_this.gridApi.selection.getSelectedRows().length === 0)
                    return;
                var rule = _this.gridApi.selection.getSelectedRows()[0];
                $lcmaDialog.remove({
                    message: ' Rule ' + rule.rule_name
                }).result.then(function () {
                    GlRules.destroy(rule.id)
                            .then(function (result) {
                                // select first one,
                                if (_this.rulesGrid.data.length) {
                                    //need timeout to make sure grid element actually associated with variable
                                    $timeout(function () {
                                        _this.select(_this.rulesGrid.data[0]);
                                        _this.gridApi.selection.selectRow(_this.rulesGrid.data[0]);
                                    });
                                } else {
                                    _this.currentSelection = null;
                                }

                            });
                });
            };


            /**
             * Holds pager instance.
             */
            _this.pager = $lcmaPager({
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
                offset: this.pager.from() - 1,
                orderBy: [['rule_name', 'ASC']]
            };


            /**
             * Selects an item
             * @param item
             */
            _this.select = function (item) {
                _this.currentSelection = item;
                var items = [];
                for (var i = 1; i < 9; i++) {
                    var l = item['fld' + i + '_operator'] ? item['fld' + i + '_operator'].logic : "";
                    var o = item['fld' + i + '_operator'] ? item['fld' + i + '_operator'].operator : "";
                    var c = item['fld' + i + '_operator'] ? item['fld' + i + '_operator'].chargeType.value : "";
                    if (i == 1) {
                        l = "";
                    }
                    items.push({
                        logic: l,
                        operator: o,
                        chargeType: c,
                        field: item['fld' + i + '_name'],
                        value: item['fld' + i + '_match_value']
                    });
                }
                rulesGrid.data = items;
                gridSelectedStringsOptions.data = item.gl_rules_glcodes;
            };

            /**
             * Clears all filters.
             */
            _this.clearFilters = function () {
                _this.query.where = {};
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
             * Refreshes data against query.
             */
            _this.refresh = function () {

                _this.query.where['id'] = {'>': -(new Date().getMilliseconds())};
                return GlRules.findAll({filter: JSON.stringify(_this.query)})
                        .then(function (data) {
                            _this.pager.total = data.$total;
                            grid.data = data;

                            // select first immediately
                            if (data.length) {
                                //need timeout to make sure grid element actually associated with variable
                                $timeout(function () {
                                    _this.select(data[0]);
                                    _this.gridApi.selection.selectRow(grid.data[0]);
                                });
                            } else {
                                _this.currentSelection = null;
                            }

                            return data;
                        });
            };

            var rulesGrid = _this.gridRulesOptions = $lcmaGrid({
                enableFiltering: false,
                enableSorting: false,
                onRegisterApi: function (api) {
                    _this.gridRulesApi = api;
                }
            })
                    .addColumn('logic', "And/Or", {
                        width: 100
                    })
                    .addColumn('chargeType', "Charge Type")
                    .addColumn('field', "Field")
                    .addColumn('operator', "Operator")
                    .addColumn('value', "Value", {
                        width: 200
                    })
                    .options();

            var gridSelectedStringsOptions = _this.gridSelectedStringsOptions = $lcmaGrid({
                enableFiltering: false,
                enableSorting: false,
                onRegisterApi: function (api) {
                    _this.gridSelectedStringsOptionsApi = api;
                }

            })
                    .addNumberColumn('apportion_pct', "Charge %", {enableCellEdit: true, width: 80})
                    .options();

            GlCodeSegments.findAll().then(function (data) {
                var columnDefaults = {
                    width: 85,
                    enableFiltering: false
                };
                for (var segment in data) {
                    if (data[segment].id) {
                        var value = data[segment].value;
                        var name = data[segment].custom_key;
                        var col = angular.extend({}, columnDefaults, {}, {
                            field: "gl_code_seg" + name[name.length - 1],
                            name: value,
                            displayName: value,
                            headerName: value
                        });
                        gridSelectedStringsOptions.columnDefs.push(col);
                    }
                }
            });

            _this.editRule = function () {
                if (_this.gridApi.selection.getSelectedRows().length === 0)
                    return;
                var rule = _this.gridApi.selection.getSelectedRows()[0];
                $state.go('app.GlRuleBuilderEdit',{id:rule.id});
            };

            _this.refresh();


        });
