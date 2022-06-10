(function () {
  'use strict';

  function BooleanFilter() {
    return function (input) {
      return input ? 'Yes' : 'No'

    };
  }

  angular.module('lcma')
    .filter('boolean', BooleanFilter);

}());
