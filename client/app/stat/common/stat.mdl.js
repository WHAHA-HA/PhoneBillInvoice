(function () {
  'use strict';

  angular.module('lcma')
    .factory('Stat', function (DS) {

      return DS.defineResource({
        name: 'stat'
      });
    });

}());
