(function () {
  'use strict';

  angular.module('lcma')
    .factory('Contract', function (DS, ContractType, $lcmaAuthToken, HistoryRefresh) {

      function transofrm(instance) {
        if(instance.id > 0) {
          instance.type = instance.type.toString();
          instance.vendor_sign_date = new Date(instance.vendor_sign_date);
          instance.company_sign_date = new Date(instance.company_sign_date);
          instance.effective_date = new Date(instance.effective_date);
          instance.termination_date = new Date(instance.termination_date);
        }
      }

      return DS.defineResource({
        name: 'contract',
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
          hasMany: {
            contractSection: {
              foreignKey: 'contract_id',
              localField: 'sections'
            },
            documents: {
              localField: 'document_entity',
              foreignKey: 'entity_id'
            }
          }
        },
        actions: {
          document: {
            method: 'GET'
          },
          deleteDocument: {
            method: 'POST'
          }
        },
        computed: {
          typeEntity: ['type', function (typeId) {
            return ContractType.find(typeId);
          }],
          document_view_url: ['document_id', 'id', function (document_id, id) {
            return '/api/document/' + document_id + '?authorization=' + $lcmaAuthToken.get()
          }],
          document_download_url: ['document_id', 'id', function (document_id, id) {
            return '/api/document/' + document_id + '/download?authorization=' + $lcmaAuthToken.get()
          }]
        },
        afterInject: function (resource, data) {

          if(angular.isArray(data) && data.length && data[0].$total) {
            var meta = data.shift();
            data.$total = meta.$total;
          }

          if(angular.isArray(data)) {
            angular.forEach(data, function (instance) {
              transofrm(instance);
            });
          }
          else {
            transofrm(data);
          }

          return data;
        }
      });
    });

}());
