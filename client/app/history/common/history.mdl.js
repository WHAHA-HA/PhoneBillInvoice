/**
 *
 */
(function () {
    'use strict';

  function HistoryFactory(DS) {

    return DS.defineResource({
      name: 'history',

      computed: {
        unique_key: ['entity_type', 'action_key', function (type, key) {
          return type + '-' + key;
        }]

      }
    });
  }

  angular.module('lcma')
    .factory('History', HistoryFactory)

}());
