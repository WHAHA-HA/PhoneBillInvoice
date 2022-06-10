(function () {
  'use strict';

  angular.module('lcma')
    .factory('GlRules', function (DS) {

      return DS.defineResource({
        name: 'gl_rules'
      });
    });

}());
