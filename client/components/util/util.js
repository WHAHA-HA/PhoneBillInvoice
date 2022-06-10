/**
 *
 */
(function (lodash) {
    'use strict';

  function ArrayUtilService() {
    return lodash;
  }

  angular.module('lcma')
    .service('ArrayUtil', ArrayUtilService);


}(_));
