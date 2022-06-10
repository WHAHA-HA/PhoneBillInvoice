/**
 *
 */
(function () {
    'use strict';
    function GLCodeListCtrl($scope, $lcmAlert, $q, $lcmaPage, $lcmaDialog, $lcmaGrid, $lcmaGridFilter, $timeout, GlCodesNonVer, GlCodeSegments) {

        $lcmaPage.setTitle('GL Code Lists');
        var _this = this;

        _this.currentSelection = {};
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
         * Selects an item
         * @param item
         */
        _this.select = function (item) {
            _this.currentSelection = item;
            _this.refreshSegmentValues();
        };

        _this.ConvertToCSV = function (objArray) {
            var t = objArray.map(function (x) {
                return {"Segment": x.segment_name.value, "Value": x.segment_value, "Description": x.segment_desc};
            });
            objArray = [{a: "Segment", b: "Value", c: "Description"}];
            objArray = objArray.concat(t);
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';
            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '')
                        line += ',';
                    line += array[i][index];
                }
                str += line + '\r\n';
            }
            return str;
        };

        _this.exportToCSV = function () {
            var q = {where: {}, orderBy: ['segment']};
            GlCodesNonVer.findAll({filter: JSON.stringify(q)}).then(function (data) {
                data = _this.ConvertToCSV(data)
                var filename = 'Segment_Values_' + (new Date()).getTime() + '.csv';
                var blob = new Blob([data], {
                    type: "text/csv;charset=utf-8;"
                });
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var save = document.createElement('a');
                    save.href = URL.createObjectURL(blob);
                    save.target = '_blank';
                    save.download = filename;
                    var event = document.createEvent("MouseEvents");
                    event.initMouseEvent(
                            "click", true, false, window, 0, 0, 0, 0, 0
                            , false, false, false, false, 0, null
                            );
                    save.dispatchEvent(event);
                }
            });
        };

        /**
         * grid definition
         */
        var grid = _this.gridOptions = $lcmaGrid({
            enableFiltering: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            enableSorting: false,
            onRegisterApi: function (api) {

                _this.gridApi = api;
                api.selection.on.rowSelectionChanged($scope, function (row) {
                    _this.select(row.entity);
                });
            }

        })
                .addColumn('value', "Segment Name", {width: '*'})
                .options();

        /**
         * Refreshes data against query.
         */
        _this.refresh = function () {
            GlCodeSegments.findAll().then(function (data) {
                grid.data = data;
                if (data.length) {
                    $timeout(function () {
                        _this.select(data[0]);
                        _this.gridApi.selection.selectRow(grid.data[0]);
                    });
                }
            });
        };

        _this.refresh();
        _this.query = {where: {}};

        _this.refreshSegmentValues = function () {
            _this.query.where['segment'] = {'===': _this.currentSelection.key};
            GlCodesNonVer.findAll({filter: JSON.stringify(_this.query)}, {bypassCache: true}).then(function (data) {
                segmentValuesgrid.data = data;
            });
        };

        _this.clearFilters = function () {
            _this.query.where = {};
            _this.segmentValuesgridApi.core.clearAllFilters(true, true, true);
            _this.refreshSegmentValues();
        };

        //Segment values grid
        var segmentValuesgrid = _this.segmentValueGridOptions = $lcmaGrid({
            enableFiltering: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            enableSorting: true,
            onRegisterApi: function (api) {

                _this.segmentValuesgridApi = api;
                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.query.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });
                    _this.refresh();
                });
                api.core.on.filterChanged($scope, function (x) {
                    $lcmaGridFilter(this.grid, _this.query)
                            .applyAll(segmentValuesgrid.columnDefs.filter(function (x) {
                                return x.enableFiltering;
                            }));
                    _this.refresh();
                });
                api.rowEdit.on.saveRow($scope, $scope.saveRow);
            }

        })
                .addColumn('segment_value', "Value", {width: 300, enableCellEdit: true})
                .addColumn('segment_desc', "Description", {width: '*', enableCellEdit: true})
                .options();

        _this.addSegmentValue = function () {
            if (segmentValuesgrid.data.filter(function (o) {
                return o.id === null || !o.id;
            }).length === 0) {
                segmentValuesgrid.data.push({segment_value: 0, segment_desc: "New", segment: _this.currentSelection.key});
            }
        };

        _this.deleteSegmentValue = function () {
            var t = _this.segmentValuesgridApi.selection.getSelectedRows();
            if (t.length === 0)
                return;
            $lcmaDialog.remove({
                message: ' CL Code Value ' + t[0].segment_value + ' (' + t[0].segment_desc + ')'
            }).result.then(function () {
                var ids = t.map(function (o) {
                    return o.id;
                });
                GlCodesNonVer.deleteAll({data: {ids: ids}}).then(function () {
                    _this.refreshSegmentValues();
                    $lcmAlert.success("Value has been deleted.");
                });
            });
        };

        $scope.saveRowFunction = function(rowEntity){
             var promise = $q.defer();
             if (rowEntity.id > 0) {
                GlCodesNonVer.update(rowEntity.id, rowEntity).then(function () {
                    $lcmAlert.success("GL Segment Value has been saved.");
                    promise.resolve();
                }, function (err) {
                    if (err.status === 406) {
                        $lcmAlert.error("Segment Value must be unique.");
                    } else {
                        $lcmAlert.error("Error while saving data.");
                    }
                    promise.reject();
                });
            } else {
                GlCodesNonVer.create(rowEntity).then(function (data) {
                    $lcmAlert.success("GL Segment Value has been saved.");
                    promise.resolve();
                    _this.refreshSegmentValues();
                }, function (err) {
                    if (err.status === 406) {
                        $lcmAlert.error("Segment Value must be unique.");
                    } else {
                        $lcmAlert.error("Error while saving data.");
                    }
                    promise.reject();
                });
            }
            return promise.promise;
        };

        $scope.saveRow = function (rowEntity) {
           var promise = $scope.saveRowFunction(rowEntity);

            _this.segmentValuesgridApi.rowEdit.setSavePromise(rowEntity, promise);

        };
    }

    angular.module('lcma')
            .controller('GLCodesListCtrl', GLCodeListCtrl);
}());
