/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Site', function (DS) {
      return DS.defineResource({
        name: 'site'
      });
    });

}());
