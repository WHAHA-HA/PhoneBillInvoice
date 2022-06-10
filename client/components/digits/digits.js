(function () {
  'use strict';

  angular.module('lcma')
    .filter('lcmaDigits', function () {
      return function (input, len) {
        var num = parseInt(input, 10);

        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
          return input;
        }
        num = '' + num;
        while (num.length < len) {
          num = '0'+num;
        }

        return num;
      };
    });
})();

