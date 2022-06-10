/**
 * Created by bear on 2/29/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('Employee', function (DS) {
      return DS.defineResource({
        name: 'employees'
      });
    });

}());
