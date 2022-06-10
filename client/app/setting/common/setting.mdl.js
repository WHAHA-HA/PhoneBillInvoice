/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('Setting', function (DS) {

      function transform(instance) {

        if (instance.id > 0) {
          instance.value = instance.value ? (JSON.parse(instance.value)) : null;
        }
      }

      return DS.defineResource({
        name: 'setting',
        actions: {
          save: {
            method: 'POST'
          }
        },
        afterInject: function (resource, data) {

          if (angular.isArray(data) && data.length && data[0].$total) {
            var meta = data.shift();
            data.$total = meta.$total;
          }

          if (angular.isArray(data)) {
            angular.forEach(data, function (instance) {
              transform(instance);
            });
          }
          else {
            transform(data);
          }

          return data;
        }
      });
    });

}());
