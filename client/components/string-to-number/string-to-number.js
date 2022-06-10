/**
 * String To Number Directive
 */
(function () {
  'use strict';

  function StringToNumberDirective() {

    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return '' + value;
        });
        ngModel.$formatters.push(function(value) {
          return parseFloat(value, 10);
        });
      }
    };

  }

  angular.module('lcma')
    .directive('stringToNumber', StringToNumberDirective);


}());
