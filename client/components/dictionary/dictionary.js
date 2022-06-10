/**
 *
 */
(function () {
    'use strict';

    function DictionaryPickerDirective(Dictionary) {

        return {
            restrict: 'EA',
            template: '<select class="form-control" name="{{name}}" ng-model = "selection" ng-options="ele.id as ele.value for ele in items"></select>',
            scope: {
                typeKey: '@',
                name: '@',
                model: '=ngModel'
            },
            controller: function ($scope) {
                $scope.selection = Number($scope.model);
                Dictionary.getDictionary($scope.typeKey).then(function (items) {
                    $scope.items = items;
                });
                $scope.$watch('selection', function (x) {
                    $scope.model = x;
                });
            }
        };

    }

    angular.module('lcma')
            .directive('lcmaDictionaryPicker', DictionaryPickerDirective);


}());
