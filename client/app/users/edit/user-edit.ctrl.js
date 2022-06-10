/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .controller('UserEditCtrl', function ($scope, $roles, $lcmaGrid, $uibModalInstance, userId, avatar, User, CommonSettings, defaultOption) {

      $scope.roles = $roles;
      $scope.selectedRoles = {};
      $scope.avatar_temp = '';
      $scope.showCropImage = false;
      $scope.picFile = '';
      $scope.defaultOption = defaultOption;

        var _this = this;

      _this.loop = true;

      /**
       * Collect all data.
       */

      $scope.query = function () {
        User.find(userId).then(function (user) {

          angular.forEach(user.roles, function (role) {

            $scope.selectedRoles[role.id] = true;
          });

          $scope.user = angular.copy(user);
          $scope.user.avatar = avatar;
        });

        //check whether portfolio updated is enabled/disabled
        CommonSettings.get()
          .then(function(settings) {
            $scope.globalAvatarUpdateAllowed = settings.allow_avatar_update !== 'false';
          });
      };

      $scope.query();

/*      $scope.watch('picFile', function() {
        console.log('avatar Image changed');
      });*/
      /**
       * Initiates update of user details.
       * @param form
         */
        $scope.update = function (form) {

            if (!form.$valid) {
                return;
            }

            if ($scope.showCropImage) {
                $scope.user.avatar = $scope.avatar_temp;
            }

            // Parse approved actions
            $scope.user.roles = [];
            angular.forEach($scope.selectedRoles, function (value, key) {
                if (value) {
                    $scope.user.roles.push(key);
                }
            });

            if ($scope.user.avatar) {
                User.resizedataURL($scope.user.avatar, function (dataUrl) {
                    $scope.user.avatar = dataUrl;
                    User.update(userId, $scope.user).then(function (user) {
                        $uibModalInstance.close(user);
                    });
                });
            } else {
                User.update(userId, $scope.user).then(function (user) {
                    $uibModalInstance.close(user);
                });
            }
        };

        $scope.EditPicture = function () {
            $scope.showCropImage = true;
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        // returns firstname + lastname initial letters
        $scope.getInitialLetters = function () {

            if (!$scope.user) {
                return '';
            }

            var firstLetter = ' ';
            var secondLetter = ' ';

            if ($scope.user.first_name) {
                firstLetter = $scope.user.first_name.charAt(0).toUpperCase();
            }

            if ($scope.user.last_name) {
                secondLetter = $scope.user.last_name.charAt(0).toUpperCase();
            }

            return firstLetter + secondLetter;
        };

    });

})();
