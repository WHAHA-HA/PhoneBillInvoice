/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaDateFilter', function ($lcmaDate, $timeout) {

      function operatorDisplay(operator) {
        if (operator === 'before') {
          return ' < ';
        }
        else if (operator === 'between') {
          return ' - ';
        }
        else if (operator === 'after') {
          return ' > ';
        }
      }

      return {
        restrict: 'EA',
        template: '<a uib-popover-template="popoverOptions.templateUrl" popover-trigger="outsideClick" popover-append-to-body="true" popover-is-open="popoverOptions.isOpen" popover-placement="auto bottom" popover-title="{{popoverOptions.title}}" type="button" class="btn btn-default btn-block btn-xs">{{ displayValue }}</a>',
        scope: {
          model: '=ngModel'
        },
        link: function (scope, elem, attrs) {

          var filter = scope.filter = {
            operator: 'between'
          };

          scope.displayValue = '...';

          scope.popoverOptions = {
            templateUrl: 'components/date-filter/date-filter.html',
            title: 'Date Filter',
            isOpen: false,

          };

          scope.$watch('model', function (val) {
            if (angular.isUndefined(val)) {
              scope.clearFilter();
            }
          });

         /* scope.$watch('popoverOptions', function (opts) {
            if(opts.isOpen) {
              var tout = $timeout(function () {
                scope.popoverOptions.isOpen = false;
                tout = null;
              }, 1000);
            }
          });*/


          scope.applyFilter = function () {

            if (filter.from) {
              scope.model = JSON.stringify(scope.filter);

              scope.displayValue = $lcmaDate(filter.from).format('MMM DD, \'YY') + operatorDisplay(filter.operator);

              if (filter.operator === 'between') {
                scope.displayValue += $lcmaDate(filter.to).format('MMM DD, \'YY');
              }

              scope.popoverOptions.isOpen = false;
            }
          };

          scope.clearFilter = function () {
            scope.model = undefined;
            scope.displayValue = '...';
            scope.popoverOptions.isOpen = false;
            scope.filter.operator = 'between';
            scope.filter.from = null;
            scope.filter.to = null;
          };

          scope.close = function () {
            scope.popoverOptions.isOpen = false;
          };
        }
      };
    })
}());
