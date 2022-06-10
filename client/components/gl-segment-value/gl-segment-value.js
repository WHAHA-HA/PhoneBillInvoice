/**
 *
 */
(function () {
    'use strict';

    function GlSegmentValuePickerDirective(GlCodesNonVer) {

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                model: '=ngModel',
                segment: '@segment'
            },
            templateUrl: 'components/gl-segment-value/gl-segment-value.html',
            controller: function ($scope) {
                $scope.selection = null;
                $scope.selection = $scope.model;


                function select() {
                    $scope.values.forEach(function (item) {
                        if (item.id === $scope.model) {
                            $scope.selection = item;
                        }
                    });
                }
                var q = {where: {
                        segment: {'===': $scope.segment}
                    }};
                GlCodesNonVer.findAll({filter: JSON.stringify(q)}, {bypassCache:true}).then(function (values) {
                    $scope.values = values;
                });

                $scope.$watch('selection', function (x) {
                    $scope.model = x;
                });

                $scope.$watch('model', function (x) {
                    $scope.selection = $scope.model;
                });


                /**
                 * check all
                 */
                $scope.checkAll = function () {
                    $scope.selection = _.map($scope.values, 'id');
                };

                /**
                 * clear all
                 */
                $scope.clearAll = function () {
                    $scope.selection = [];
                };

                $scope.clearItem = function () {
                    $scope.selection = null;
                };

            }
        };

    }

    angular.module('lcma')
            .directive('lcmaGlSegmentValuePicker', GlSegmentValuePickerDirective);


}());
