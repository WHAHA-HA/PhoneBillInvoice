/**
 *
 */
(function () {
    'use strict';
    function GLStringListCtrl($scope, $lcmAlert, GlCodeSegments, $lcmaPage, $lcmaDialog, $lcmaGrid, User, uiGridConstants, $lcmaPager, $lcmaGridFilter, $timeout, GlString) {

        $lcmaPage.setTitle('GL Strings Lists');
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

        GlCodeSegments.findAll().then(function (data) {
            var columnDefaults = {
                width: 85,
                enableFiltering: false,
                sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC]
            };
            for (var segment in data) {
                if (data[segment].id) {
                    var value = data[segment].value;
                    var name = data[segment].custom_key;
                    var col = angular.extend({}, columnDefaults, {}, {
                        field: name+"_obj.segment_value",
                        name: value,
                        displayName: value,
                        headerName: value
                    });

                    grid.columnDefs.push(col);
                }
            }
        });

        /**
         * grid definition
         */
        var grid = _this.gridOptions = $lcmaGrid({
            exporterCsvFilename: 'gl_strings.csv',
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
                .addColumn('full_string_formatted', "Full GL String", {
                    width: '*',
                    enableFiltering: false,
                    minWidth:200,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.full_string_formatted}}</div>'
                })
                .addColumn('gl_code_type', "GL Code Type", {width: 100})
                .addDateColumn('date_added', "Date Added", {width: 90})
                .addRelColumn('user_created', "Created By", {
                    width: 100,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.user.first_name}} {{row.entity.user.last_name}}</div>',
                    filter: {
                        term: -1,
                        type: uiGridConstants.filter.SELECT,
                        nulls: true,
                        selectOptions: User.findAll(),
                        map: function (x) {
                            return {value: x.id, label: x.first_name + " " + x.last_name};
                        }
                    }
                })
                .addBooleanColumn('status', "Status", {
                    width: 80,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.status?"Active":"Inactive"}}</div>',
                    filter: {
                        term: -1,
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [
                            {key: true, label: 'Active', value: 1},
                            {key: false, label: 'Inactive', value: 0}
                        ]
                    }
                })
                .options();

        /**
         * Refreshes data against query.
         */
        _this.refresh = function () {
            _this.query.where['id'] = {'>': -(new Date().getMilliseconds())};
            return GlString.findAll({filter: JSON.stringify(_this.query)}).then(function (data) {
                grid.data = data;
                _this.pager.total = data.$total;

                if (data.length) {
                    $timeout(function () {
                        _this.select(data[0]);
                        _this.gridApi.selection.selectRow(grid.data[0]);
                    });
                }
                return data;
            });
        };

        _this.select = function (item) {
            _this.currentSelection = item;
            _this.resolvesEdit = {
                'glstring': angular.copy(item)
            };

        };

        _this.newString = function () {
            _this.currentSelection = null;
            _this.gridApi.selection.clearSelectedRows();
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
         * Holds invoice query.
         */
        _this.query = {
            where: {},
            limit: _this.pager.size,
            offset: this.pager.from() - 1
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

        _this.refresh();

        //Discard content and reload original one
        _this.onDismiss = function (create) {
            if (create) {
                return;
            }

            var selectedRows = _this.gridApi.selection.getSelectedRows();
            if (selectedRows.length > 0) {
                _this.select(angular.copy(selectedRows[0]));
            }
        };

        _this.onChange = function (data, create) {
            if (create) {
                grid.data.push(data);
                _this.currentSelection = data;
                $timeout(function () {
                    _this.gridApi.selection.selectRow(data);
                });
                $lcmAlert.success('New GL String has been created');
            } else {
                var index = grid.data.map(function (o) {
                    return o.id;
                }).indexOf(data.id);
                grid.data[index] = data;
                $lcmAlert.success('GL String has been updated');
            }

        };

    }

    angular.module('lcma')
            .controller('GLStringListCtrl', GLStringListCtrl);
}());
