/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Project', function (DS, HistoryRefresh) {

      function transform(instance) {

        if(instance.id > 0) {
          instance.start_date = instance.start_date? (new Date(instance.start_date)) : null;
          instance.end_date = instance.end_date ? (new Date(instance.end_date)) : null;
        }
      }

      return DS.defineResource({
        name: 'project',
         afterUpdate:  function (resource, data, cb) {
            HistoryRefresh.refresh();
            if (cb) {
                cb(null, data);
            }
        },
        afterCreate:  function (resource, data, cb) {
            HistoryRefresh.refresh();
            if (cb) {
                cb(null, data);
            }
        },
        afterDestroy:  function (resource, data, cb) {
            HistoryRefresh.refresh();
            if (cb) {
                cb(null, data);
            }
        },
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
