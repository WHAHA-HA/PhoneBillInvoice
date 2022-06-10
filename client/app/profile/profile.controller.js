'use strict';

angular.module('lcma')
  .controller('ProfileCtrl', function ($scope, $uibModalInstance, $uibModal, User) {

      $scope.showCropImage = false;
      $scope.picFile = '';
      $scope.avatar_temp = '';
      $scope.user = angular.copy($scope.$me);

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

      $scope.UploadPicture = function () {
          $scope.showCropImage = true;
      };

      $scope.RemovePicture = function () {
          $scope.showCropImage = false;
          $scope.user.avatar = null;
          $scope.picFile = '';
          $scope.avatar_temp = '';
      };

      $scope.save = function (form) {

        $scope.errMsg = '';
        $scope.emailErrMsg = '';
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        if ($scope.avatar_temp !== '') {

            if ($scope.showCropImage) {
                $scope.user.avatar = $scope.avatar_temp;
            }

              //User.resizedataURL($scope.user.avatar, function (dataUrl) {
                //  $scope.user.avatar = dataUrl;
            var payload = {
              avatar: $scope.user.avatar,
              first_name: $scope.user.first_name,
              last_name: $scope.user.last_name,
              email: $scope.user.email,
              mobile_number: $scope.user.mobile_number
            };

            User.profile($scope.$me.id, {data: payload}).then(function (user) {

              $scope.$me.avatar = $scope.user.avatar;
              $scope.$me.first_name = $scope.user.first_name;
              $scope.$me.last_name = $scope.user.last_name;
              $scope.$me.email = $scope.user.email;
              $scope.$me.mobile_number = $scope.user.mobile_number;

              $uibModalInstance.close(user);
            }, function(error) {
              if (error.data.email && error.data.email.length > 0) {
                $scope.emailErrMsg = error.data.email[0];
              }
              else {
                $scope.errMsg = 'Internal error';
              }
            });


        } else {

          var payload = {
            avatar: null,
            first_name: $scope.user.first_name,
            last_name: $scope.user.last_name,
            email: $scope.user.email,
            mobile_number: $scope.user.mobile_number
          };

          User.profile($scope.user.id, {data: payload}).then(function (user) {

            $scope.$me.avatar = null;
            $scope.$me.first_name = $scope.user.first_name;
            $scope.$me.last_name = $scope.user.last_name;
            $scope.$me.email = $scope.user.email;
            $scope.$me.mobile_number = $scope.user.mobile_number;

            $uibModalInstance.close(user);
          }, function(error) {
            if (error.data.email && error.data.email.length > 0) {
              $scope.emailErrMsg = error.data.email[0];
            }
            else {
              $scope.errMsg = 'Internal error';
            }
          });
        }
      };

      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };


  });
