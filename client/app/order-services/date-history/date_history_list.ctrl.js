/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .controller('DateHistoryListCtrl', function ($scope, $lcmaGrid, $uibModalInstance, dates, type, defaultGrid, User) {
                var _this = this;
        
                $scope.type = type;

                _this.focGridBuilder = function () {
                    return $lcmaGrid({
                        enableFiltering: false,
                        onRegisterApi: function (api) {
                        }
                    })
                            .addColumn('id', '#', {
                                width: 40
                            })
                            .addDateColumn('foc_date', 'FOC Date')
                            .addDateColumn('foc_rec_date', 'FOC Receive Date')
                            .addColumn('reason.value', 'Reason Missed')
                            .addColumn('note', 'Note')
                            .addColumn('changed_by', 'Created By')
                            .addDateColumn('changed_at', 'Action Date')
                            .options();
                }
                
                _this.testGridBuilder = function () {
                    return $lcmaGrid({
                        enableFiltering: false,
                        onRegisterApi: function (api) {
                        }
                    })
                            .addColumn('id', '#', {
                                width: 40
                            })
                            .addDateColumn('date', 'Test Date')
                            .addColumn('pass', 'Status', {
                                cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.pass?"Pass":"Fail"}}</div>'
                            })
                            .addColumn('note', 'Note')
                            .addColumn('changed_by', 'Created By')
                            .addDateColumn('changed_at', 'Action Date')
                            .options();
                }

                _this.defaultGridBuilder = function () {
                    return $lcmaGrid({
                        enableFiltering: false,
                        onRegisterApi: function (api) {
                        }
                    })
                            .addColumn('id', '#', {
                                width: 40
                            })
                            .addDateColumn('date', 'Date')
                            .addColumn('note', 'Note')
                            .addColumn('changed_by', 'Created By')
                            .addDateColumn('changed_at', 'Action Date')
                            .options();
                }

                for (var i in dates) {
                    dates[i].id = (Number(i) + 1);
                }
                if(defaultGrid === "test"){
                    $scope.grid = _this.testGridBuilder();
                } else {
                    $scope.grid = defaultGrid ? _this.defaultGridBuilder() : _this.focGridBuilder();
                }
                $scope.grid.data = dates;



                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });


}());
