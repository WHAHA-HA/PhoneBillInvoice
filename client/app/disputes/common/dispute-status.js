/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('DisputeStatus', function (Dictionary) {

      var typeKey = 'dispute-status';

      function DisputeStatus() {

      }

      DisputeStatus.findAll = function () {
        return Dictionary.getDictionary(typeKey);
      };

      return DisputeStatus;

    });

}());