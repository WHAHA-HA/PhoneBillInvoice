(function () {
  'use strict';

  angular.module('lcma')
    .factory('Role', function (DS) {

      return DS.defineResource({
        name: 'role'
      });
    });

}());
