/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('[MODULE]', function (DS) {
      return DS.defineResource({
        name: '[MODULE]'
      });
    });

}());
