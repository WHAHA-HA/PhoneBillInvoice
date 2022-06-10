/**
 *
 */
(function () {
  'use strict';

  function CommonSettingsService(Dictionary) {

    function get() {

      var obj = {};

      return Dictionary.getDictionary('common-settings')
        .then(function (result) {

          result.forEach(function (x) {
            obj[x.custom_key] = x.value;
          });

          return obj;

        });
    }

    return {
      get: get
    }
  }

  angular.module('lcma')
    .service('CommonSettings', CommonSettingsService)


}());
