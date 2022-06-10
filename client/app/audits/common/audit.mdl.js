(function () {
  'use strict';

  angular.module('lcma')
    .factory('Audit', function (DS) {

      return DS.defineResource({
        name: 'audit'
      });
    });

}());
