/**
 *
 */
(function () {
    'use strict';

    function AdvancedFilterDirective($lcmaAdvancedFilter) {

        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/advanced-filter/advanced-filter.html',
            scope: {
                properties: '=properties',
                context: '=ngModel'
            },
            link: function (scope, elem, attrs) {
                var currentFilterProperty = scope.context && scope.context.property ? scope.context.property.name : null;
                scope.operators = {
                    number: [
                        {title: 'Less Than', value: '<', editor: 'number'},
                        {title: 'Less than or Equal To', value: '<=', editor: 'number'},
                        {title: 'Not Equal To', value: '!==', editor: 'number'},
                        {title: 'Equals', value: '===', editor: 'number'},
                        {title: 'Greater Than', value: '>', editor: 'number'},
                        {title: 'Greater than or Equal To', value: '>=', editor: 'number'},
                        {title: 'Between', value: '<>', editor: 'number-between'}
                    ],
                    date: [
                        {title: 'Before', value: '<', editor: 'date'},
                        {title: 'After', value: '>', editor: 'date'},
                        {title: 'Between', value: '<>', editor: 'date-between'}
                    ],
                    text: [
                        {title: 'Equals', value: '===', editor: 'text'},
                        {title: 'Contains', value: '*', editor: 'text'},
                        {title: 'Start With', value: '^', editor: 'text'}
                    ]
                };


                scope.$watch('context', function (x) {
                    if (scope.context.property) {
                        var i = scope.operators[scope.context.property.type].map(function (o) {
                            return o.value;
                        }).indexOf(scope.context.operator);
                        scope.context.operator = scope.operators[scope.context.property.type][i];
                    }

                    if (!x || currentFilterProperty !== x.name) {
                        currentFilterProperty = x ? x.name : undefined;
                        //delete scope.context.operator;
                        //  delete scope.context.value;
                    }
                });

            }
        };

    }

    function AdvancedFilterProvider() {


        this.$get = function () {

            var instance = {};

            // select field
            // display list of operators based on field type
            // display value selector based on field type and selected operator


            return instance;

        };
    }

    function AdvancedFilterDirectiveEditor() {
        return {
            restrict: 'EA',
            replace: true,
            template: '<ng-include src="templateUrl"></ng-include>',
            scope: {
                model: '=ngModel',
                editor: '@'
            },
            link: function (scope, elem, attrs) {


                scope.onModelChange = function (model) {
                    scope.model = model;
                };

                scope.$watch('editor', function (x) {
                    if (x) {
//                        if (x.indexOf("between") >= 0)
//                            scope.model = {};
                        scope.templateUrl = 'components/advanced-filter/advanced-filter-' + x + '.html';
                    }
                });

            }
        };
    }

    angular.module('lcma')
            .provider('$lcmaAdvancedFilter', AdvancedFilterProvider)
            .directive('lcmaAdvancedFilter', AdvancedFilterDirective)
            .directive('lcmaAdvancedFilterEditor', AdvancedFilterDirectiveEditor);

}());
