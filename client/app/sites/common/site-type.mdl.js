/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('SiteType', function (Dictionary) {

      var typeKey = 'site-type';

      function SiteType() {

      }

      SiteType.findAll = function () {
        return Dictionary.getDictionary(typeKey);
      };

      return SiteType;

    });

}());
