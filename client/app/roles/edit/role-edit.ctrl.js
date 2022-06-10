/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
      .controller('RoleEditCtrl', function ($scope, $roles, $currentRole, $lcmaGrid, $uibModalInstance, Role) {

      $scope.roles = $roles;


      var role = $scope.role = angular.copy($currentRole);

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }
        Role.update(role.id, {
          id: role.id,
          name: role.name
        }).then(function (role) {
          $uibModalInstance.close(role);
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
