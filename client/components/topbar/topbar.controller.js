'use strict';

angular.module('lcma')
  .controller('TopbarCtrl', function ($scope, $uibModal) {

    //$broadcast.emit('lhs:toggle');


    $scope.editTheme = function () {
      $uibModal.open({
        templateUrl: 'app/theme/theme.html',
        controller: 'ThemeCtrl',
        size:'md',
        backdrop: 'static'
      }).result.then(function () {

      });
    };

    // returns firstname + lastname initial letters
    $scope.getInitialLetters = function(user) {

      if (!user) {
        return '';
      }

      var firstLetter = ' ';
      var secondLetter = ' ';

      if (user.first_name) {
        firstLetter = user.first_name.charAt(0).toUpperCase();
      }

      if (user.last_name) {
        secondLetter = user.last_name.charAt(0).toUpperCase();
      }

      return firstLetter+secondLetter;
    };

    /**
     * shows profile window
     */
    $scope.editProfile = function () {
      $uibModal.open({
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'ctx',
        backdrop: 'static',
        windowClass: 'app-modal-window'
      }).result.then(function () {

        });

    };

    /**
     * shows password window
     */
    $scope.editPassword = function () {
      $uibModal.open({
        templateUrl: 'app/profile/password.html',
        controller: 'PasswordUpdateCtrl',
        controllerAs: 'ctx',
        backdrop: 'static',
        windowClass: 'app-modal-window'
      }).result.then(function () {

        });

    };

});
