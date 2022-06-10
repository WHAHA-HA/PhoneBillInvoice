/**
 *
 */
(function () {
    'use strict';

    function QuickFilterDirective($broadcast) {

        return {
            restrict: 'EA',
            scope: {
                schema: '=',
                column: '=',
                query: '=',
                //if control outside
                quickFilter: '=?',
                applyFilter: '&?'
            },
            templateUrl: 'components/quick-filter/quick-filter.html',
            link: function (scope, elem, attrs) {
                scope.quickFilter = [];

                if (!scope.applyFilter) {
                    scope.$watch('query.where', function (val) {
                        if (!val[scope.column]) {
                            scope.quickFilter = [];
                        } else if (val[scope.column].in) {
                            scope.quickFilter = val[scope.column].in;
                            if (scope.quickFilter.indexOf(-1) > -1) {
                                scope.quickFilter = [];
                            }
                        }

                    }, true);
                }

                scope.applyQuickFilterFn = function (value) {
                    if (scope.applyFilter) {
                        scope.applyFilter({item: value});
                        return;
                    }
                    if (scope.quickFilter.indexOf(value) < 0) {
                        scope.quickFilter.push(value);
                    } else {
                        var t = scope.quickFilter.indexOf(value);
                        scope.quickFilter.splice(t, 1);
                    }
                    if (value == -1 || scope.quickFilter.length === 0) {
                        scope.quickFilter = [];
                    }
                    $broadcast.emit('update-filter-text', {
                        column: scope.column,
                        values: scope.quickFilter
                    });
                };
            }

        };

    }

    angular.module('lcma')
            .directive('lcmaQuickFilter', QuickFilterDirective);

}());
