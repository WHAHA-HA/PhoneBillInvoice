/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .factory('Permission', function (DS) {
      return DS.defineResource({
        name: 'permission',
        actions: {
          me: {
            method: 'GET'
          }
        }
      });
    })
    .factory("PermissionService", function($rootScope, $q){        
       return {
           isAllowed : function(action, module){
               var defer = $q.defer();
               if($rootScope.$permissions){
                   var id = $rootScope.$permissions.map(function(o){
                        return o.module_id;
                    }).indexOf(module);
                    if(id<0) {
                        defer.resolve(false);
                    } else {
                        var a = $rootScope.$permissions[id].actions.map(function(o){
                            return o.name;
                        }).indexOf(action);
                        defer.resolve(a>=0);
                    }
               } else {
                   defer.reject();
               }
               return defer.promise;
           }
       };         
    });

}());
