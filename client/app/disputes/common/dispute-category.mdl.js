(function () {
  'use strict';

  angular.module('lcma')
    .factory('DisputeCategory', function (DS) {

      return DS.defineResource({
        name: 'dispute-category'
      });
    });

}());
