/**
 * Created by bear on 2/22/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('Equipment', function (DS) {

      function transform(instance) {

        if(instance.id > 0) {
            instance.acq_date = instance.acq_date ? (new Date(instance.acq_date)) : null;
            instance.in_svc_date = instance.in_svc_date ? (new Date(instance.in_svc_date)) : null;
        }

      }


      return DS.defineResource({
        name: 'equipments',
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
