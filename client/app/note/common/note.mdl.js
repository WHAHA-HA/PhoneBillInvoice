(function () {
  'use strict';

  angular.module('lcma')
    .factory('Note', function (DS) {

      return DS.defineResource({
        name: 'note'
      });
    });

}());
