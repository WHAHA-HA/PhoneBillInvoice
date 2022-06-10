'use strict';

angular.module('lcma')
    .controller('OrdersCtrl', function ($scope, $broadcast, $filter, $state, $stateParams, $location, $lcmAlert, $uibModal, $lcmaPage, $lcmaGrid, $lcmaPager, $lcmaGridFilter, $lcmaDialog, uiGridConstants, invoiceService, Order, OrderType, OrderStatus, User) {
        if ($location.search().status) {
            $scope.onlyNew = true;
        }
        $lcmaPage.setTitle('Order List');

        var _this = this;

        var status = null;
        var onlyNew = false;
        _this.orderTypes = [];

        OrderType.findAll().then(function (data) {
            _this.orderTypes = data;
        });

        $scope.onSettingsUpdate = function (settings) {
            lcmaGrid.updateFromSettings(settings, _this.ordersGridApi);
        };

        /**
         * Holds grid settings
         * @type {settings}
         */
        var lcmaGrid = $lcmaGrid({
            exporterCsvFilename: 'orders.csv',
            settingKey: 'orders.list.grid',
            exporterFieldCallback: function (grid, row, col, value) {
                if (col.field === 'type_id') {
                    value = row.entity.type.value;
                }
                else if (col.field === 'state') {
                    value = _this.loadStatus(value)
                }
                else if (col.field === 'approver_id') {
                    value = row.entity.approver ? row.entity.approver.full_name : null;
                }
                else if (col.field === 'requester_id') {
                    value = row.entity.requester ? row.entity.requester.full_name : null;
                }
                else if (col.field === 'processor_id') {
                    value = row.entity.processor ? row.entity.processor.full_name : null;
                }
                else if (col.field === 'request_date') {
                    value = $filter('lcmaDate')(value);
                }
                else if (col.field === 'created_at') {
                    value = $filter('lcmaDate')(value);
                }
                else if (col.field === 'send_date') {
                    value = $filter('lcmaDate')(value);
                }

                return value ? value.toString() : null;
            },
            multiSelect: false,
            onRegisterApi: function (api) {
                _this.ordersGridApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.orderQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                    _this.refresh();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.orderQuery)
                        .applyAll(grid.columnDefs.filter(function (x) {
                            return x.enableFiltering;
                        }));

                    _this.refresh();

                });
            }
        })
            .addColumn('id', 'Order #', {
                cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.editOrder({id: row.entity.id})"">{{row.entity.id}}</a></div>',
            })
            .addRelColumn('type_id', "Order Type", {
                // cellFilter: 'lcmaOrderType',
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.type.value}}</div>',
                filter: {
                    term: -1,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: OrderType.findAll(),
                    map: function (x) {
                        return {value: x.id, label: x.value}
                    }
                }
            })
            .addRelColumn('state', "Status", {
                cellFilter: 'lcmaOrderStatus',
                filter: {
                    term: -1,
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: OrderStatus.findAll(),
                    map: function (x) {
                        return {value: x.custom_key, label: x.value}
                    }
                }
            })
            .addRelColumn('approver_id', "Approver", {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.approver.full_name}}</div>',
                width: 120,
                filter: {
                    term: -1,
                    type: uiGridConstants.filter.SELECT,
                    nulls: true,
                    selectOptions: User.findAll(),
                    map: function (x) {
                        return {value: x.id, label: x.full_name};
                    }
                }
            })
            .addRelColumn('requester_id', "Requestor", {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.requester.full_name}}</div>',
                width: 120,
                filter: {
                    term: -1,
                    type: uiGridConstants.filter.SELECT,
                    nulls: true,
                    selectOptions: User.findAll(),
                    map: function (x) {
                        return {value: x.id, label: x.full_name};
                    }
                }
            })
            .addRelColumn('processor_id', "Processor", {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.processor.full_name}}</div>',
                width: 120,
                filter: {
                    term: -1,
                    type: uiGridConstants.filter.SELECT,
                    nulls: true,
                    selectOptions: User.findAll(),
                    map: function (x) {
                        return {value: x.id, label: x.full_name};
                    }
                }
            })
            .addDateColumn('request_date', 'Request Date')
            .addDateColumn('created_at', 'Create Date')
            .addDateColumn('send_date', 'Sent Date');


        var grid = _this.ordersGrid = lcmaGrid.options();

        this.loadStatus = $scope.loadStatus = function (id) {
            return OrderStatus.getStatus(id).label;
        };
        /**
         * Holds pager instance.
         */
        _this.pager = $lcmaPager({
            onGo: function () {
                _this.orderQuery.limit = _this.pager.size;
                _this.orderQuery.offset = _this.pager.from() - 1;
                _this.refresh();
            }
        });

        /**
         * Holds invoice query.
         */
        _this.orderQuery = {
            where: {},
            limit: _this.pager.size,
            offset: this.pager.from() - 1,
            orderBy: [['id', 'DESC']]
        };

        /**
         * Initiates order edit.
         * @type {$scope.editOrder}
         */
        _this.editOrder = $scope.editOrder = function (order) {
            $state.go('app.orderEdit', {id: order.id})
        };


        /**
         * Opens add order dialog
         */
        _this.newOrder = function () {

            $state.go('app.orderNew', {id: null})

        };

        /**
         * Clears all filters.
         */
        _this.clearFilters = function () {
            _this.orderQuery.where = {};
            _this.ordersGridApi.core.clearAllFilters(true, true, true);
            _this.refresh();
        };


        /**
         * Initiates export to CSV action.
         */
        _this.exportToCSV = function () {

            var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
            _this.ordersGridApi.exporter.csvExport('all', 'all', myElement);

        };

        /**
         * Refreshes data against query.
         */
        _this.refresh = function () {
            if ($location.search().status && !onlyNew) {
                status = $location.search().status;
                onlyNew = true;
            }
            _this.orderQuery.where['status_id'] = {'===': (status || 0)};
            if (status === null) {
                delete _this.orderQuery.where['status_id'];
            }

            _this.orderQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
            return Order.findAll({filter: JSON.stringify(_this.orderQuery)})
                .then(function (data) {
                    grid.data = data;
                    _this.pager.total = data.$total;
                    return data;
                });
        };

        OrderType.findAll().then(function (types) {
            _this.orderTypes = types;
        });

        _this.refresh();
    });
