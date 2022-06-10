/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('AppModule', function (DS) {
      return DS.defineResource({
        name: 'module',
        idAttribute: 'key'
      });
    });

}());
