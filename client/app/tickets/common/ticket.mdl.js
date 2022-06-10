/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Ticket', function (DS) {

      function transform(instance) {

        if(instance.id > 0) {
          instance.created_date = instance.created_date ? (new Date(instance.created_date)) : null;
        }
      }

      return DS.defineResource({
        name: 'ticket',
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
