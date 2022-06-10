(function () {
  'use strict';

  angular.module('lcma')
    .factory('ProjectOrder', function (DS, HistoryRefresh) {

      function transform(instance) {

        if(instance.id > 0) {
          instance.proj_comp_date = instance.proj_comp_date? (new Date(instance.proj_comp_date)) : null;
          instance.bill_start_date = instance.bill_start_date ? (new Date(instance.bill_start_date)) : null;
          instance.bill_end_date = instance.bill_end_date ? (new Date(instance.bill_end_date)) : null;
        }
      }

      return DS.defineResource({
        name: 'projectOrder',
        endpoint: 'order',         
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
        relations: {
          belongsTo: {
            project: {
              parent: true,
              localKey: 'project_id',
              localField: 'project'
            }
          }
        }
      });
    });

}());
