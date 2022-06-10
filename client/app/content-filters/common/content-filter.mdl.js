/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('ContentFilter', function (DS) {
      return DS.defineResource({
        name: 'content-filter',
        computed: {
          caption: ['title', 'context', function (title, context) {
            return title || context.property + ' ' + context.operator + ' ' + context.value;
          }]
        }
      });
    });

}());
