/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Performance', function (DS) {

      function transform(instance) {

        if(instance.id > 0) {
          instance.performance_date = instance.performance_date ? (new Date(instance.performance_date)) : null;
        }
      }

      return DS.defineResource({
        name: 'performance',
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
