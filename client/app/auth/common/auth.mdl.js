/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Auth', function (DS) {

      return DS.defineResource({
        name: 'auth',
        actions: {
          login: {
            method: 'POST'
          },
          sendResetInstructions: {
            method: 'POST'
          },
          resetPassword: {
            method: 'POST'
          }
        }
      });

    });
}());
