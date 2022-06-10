/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('AccountStatus', function (Dictionary) {

      var typeKey = 'account-status';

      function AccountStatus() {

      }

      AccountStatus.findAll = function () {
        return Dictionary.getDictionary(typeKey);
      };

      return AccountStatus;

    });

}());
