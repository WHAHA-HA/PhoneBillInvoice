/**
 * Created by mac on 2/19/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('Customer', function (DS) {
      return DS.defineResource({
        name: 'customers'
      });
    });

}());
