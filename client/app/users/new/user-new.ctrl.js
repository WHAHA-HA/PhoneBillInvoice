/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('UserNewCtrl', function ($scope, $roles, $lcmaGrid, $uibModalInstance, User, Dictionary) {

      $scope.roles = $roles;
      $scope.selectedRoles = {};
      $scope.avatar_temp = '';
      $scope.showCropImage = false;

      //check whether portfolio updated is enabled/disabled
      Dictionary.getDictionary('common-settings')
        .then(function(items) {
          if (items.length>0 && items[0].value === 'true') {
            $scope.globalAvatarUpdateAllowed = true;
          }
          else {
            $scope.globalAvatarUpdateAllowed = false;
          }
        });


      var user = $scope.user = {
        is_active: true
      };

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        if ($scope.showCropImage) {
          $scope.user.avatar = $scope.avatar_temp;
        }
        // Parse approved actions
        user.roles = [];
        angular.forEach($scope.selectedRoles, function (value, key) {
          if(value) {
            $scope.user.roles.push(key);
          }
        });

        //User.resizedataURL($scope.user.avatar, function(dataUrl) {
        //  $scope.user.avatar = dataUrl;
        //  User.update(userId, $scope.user).then(function (user) {
        //    $uibModalInstance.close(user);
        //  });
        //});
        if ($scope.user.avatar) {
          User.resizedataURL($scope.user.avatar, function(dataUrl) {
            $scope.user.avatar = dataUrl;
            User.create({
              email: $scope.user.email,
              first_name: $scope.user.first_name,
              last_name: $scope.user.last_name,
              password: $scope.user.password,
              password_confirm: $scope.user.password_confirm,
              username: $scope.user.username,
              roles: $scope.user.roles,
              mobile_number: $scope.user.mobile_number,
              avatar: $scope.user.avatar
            }).then(function (user) {
              $uibModalInstance.close(user, true);
            });
          });
        }
        else {
          User.create({
            email: $scope.user.email,
            first_name: $scope.user.first_name,
            last_name: $scope.user.last_name,
            password: $scope.user.password,
            password_confirm: $scope.user.password_confirm,
            username: $scope.user.username,
            mobile_number: $scope.user.mobile_number,
            roles: $scope.user.roles
          }).then(function (user) {
            $uibModalInstance.close(user, true);
          });
        }
      };

      $scope.EditPicture = function() {
        $scope.showCropImage = true;
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });

}());
