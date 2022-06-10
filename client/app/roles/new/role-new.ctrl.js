/**
 *
 */
(function () {
  'use strict';


   function RoleNewCtrl ($scope, $roles, $uibModalInstance, Role) {
      $scope.roles = $roles;


      var role = $scope.role = {

      };

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }
        Role.create({
          name: role.name
        }).then(function (role) {
          $uibModalInstance.close(role, true);
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }

  angular.module('lcma')
      .controller('RoleNewCtrl', RoleNewCtrl);
  
  angular.module('lcma')
      .controller('RoleNewInlineCtrl', function ($scope, $broadcast, Role) {
           $broadcast.on('inline-role-new-data', function (opt, data) {
                    var $uibModalInstance = {
                        close: function (data) {
                            $broadcast.emit('inline-role-new-close', {op: 'close', data: data});
                        },
                        dismiss: function (data) {
                            $broadcast.emit('inline-role-new-close', {op: 'dismiss', data: data});
                        }
                    };                    
                    RoleNewCtrl($scope, data.$roles, $uibModalInstance, Role);
                });
  });

}());
