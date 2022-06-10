/**
 *
 */
(function () {
  'use strict';


  function IfRoleDirective() {
    return {
      link: function (scope, elem, attrs) {

        //console.log(scope.$me);


        attrs.$observe('ifRole', function (val) {
          var me = scope.$me;
          console.log(me);
          var roles = me.roles.filter(function (x) {
            return x.name === val
          });
          if (!roles.length) {
            elem.hide();
          }
          else {
            elem.show();
          }
        });

      }
    }
  }



  function RoleProvider() {

    this.$get = function () {

      var instance = {};

      instance.isUnrestricted = function(user) {
        return instance.isInRole(user, 'Administrator');
      }

      instance.isInRole = function (me, role) {

        if (!angular.isArray(role)) {
          role = [role];
        }

        var roles = me.roles.filter(function (x) {
          return role.indexOf(x.name) > -1;
        });

        return roles.length;
      };

      return instance;

    }
  }

  function RolePickerDirective(Role, $uibModal) {

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        model: '=ngModel'
      },
      templateUrl: 'components/role/role.html',
      controller: function ($scope) {
        $scope.selection = null;
        $scope.selection = $scope.model;

        function select(){
          $scope.roles.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          })
        }

        Role.findAll().then(function (roles) {
          $scope.roles = roles;
        });

        $scope.$watch('selection', function(x){
          $scope.model = x;
        });

        /**
         * Opens add roles dialog
         */
        $scope.addItem = function () {
            $uibModal.open({
                templateUrl: 'app/roles/new/role-new.html',
                controller: 'RoleNewCtrl',
                backdrop: 'static',
                size: "sm",
                resolve: {
                    $roles: null
                  }
          }).result.then(function (role) {
            $scope.roles.push(role);
          });
        };

      }
    };

  }

  angular.module('lcma')
    .directive('ifRole', IfRoleDirective)
    .directive('lcmaRolePicker', RolePickerDirective)
    .provider('$lcmaRole', RoleProvider);

}());
