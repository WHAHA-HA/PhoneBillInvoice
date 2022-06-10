/**
 *
 */
(function () {
  'use strict';

  function UserPickerDirective(User, $uibModal) {

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        model: '=ngModel'
      },
      templateUrl: 'components/user/user.html',
      controller: function ($scope) {
        $scope.selection = null;
        $scope.selection = $scope.model;

        function select(){
          $scope.users.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          })
        }

        User.findAll().then(function (users) {
          $scope.users = users;

          //select();
        });

        $scope.$watch('selection', function(x){
          $scope.model = x;
        });

        /**
         * Opens add users dialog
         */
        $scope.addItem = function () {
          $uibModal.open({
            templateUrl: 'app/users/new/user-new.html',
            controller: 'UserNewCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window'
          }).result.then(function (user) {
            $scope.users.push(user);
          });
        };

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaUserPicker', UserPickerDirective);


}());
