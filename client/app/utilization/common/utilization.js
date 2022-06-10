/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Utilization', function (DS) {

      function transform(instance) {

      }

      return DS.defineResource({
        name: 'utilization',
        afterInject: function (resource, data) {

          if(angular.isArray(data) && data.length && data[0].$total) {
            var meta = data.shift();
            data.$total = meta.$total;
          }

          if(angular.isArray(data)) {
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
