/**
 *
 */
(function () {
    'use strict';

    function PermissionEditCtrl($scope, $uibModalInstance, $currentPermission, ContentFilter, Permission) {

        var permission = $scope.permission = angular.copy($currentPermission);
        $scope.allPermissions = false;
        var permissions = $scope.permissions = {};

        function findAction(actions, action) {
            for (var i = 0; i < actions.length; i++) {
                if (actions[i].name === action) {
                    return actions[i];
                }
            }
        }

        angular.forEach(permission.module.actions, function (action) {
            permissions[action] = !!findAction(permission.actions, action);
        });
        
        ContentFilter.findAll({
            where: {
                module_id: {'===': permission.module.key}
            }
        }).then(function (filters) {
            $scope.filters = filters;
        });

        $scope.addFilter = function (filter) {

            var filters = permission.filters = permission.filters || [];
            if (filters.indexOf(filter) === -1) {
                filters.push(filter);
            }
        };

        $scope.removeFilter = function (filter, index) {
            var filters = permission.filters = permission.filters || [];
            filters.splice(index, 1);
        };


        $scope.update = function () {

            // Parse approved actions
            permission.actions = [];
            angular.forEach(permissions, function (value, key) {
                if (value) {
                    permission.actions.push(key);
                }
            });

            // Parse filters
            // TODO:

            Permission.update(permission.id, permission)
                    .then(function (data) {
                        $uibModalInstance.close(data);
                    });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    }


    angular.module('lcma')
            .controller('PermissionEditCtrl', PermissionEditCtrl);
}());
