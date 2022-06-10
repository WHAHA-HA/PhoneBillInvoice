/**
 *
 */
(function () {
    'use strict';

    function PermissionNewCtrl($scope, $modules, $lcmAlert, $roles, $uibModalInstance, ContentFilter, Permission) {

        var permission = $scope.permission = {
            module: {}
        };
        var allPermissions = $scope.allPermissions = false;
        var permissions = $scope.permissions = {};
        var modules = $scope.modules = $modules;
        var roles = $scope.roles = $roles;

        $scope.moduleSelected = function () {
            if (!permission.module.key) {
                return;
            }

            $scope.filters = [];

            ContentFilter.findAll({
                where: {
                    module_id: {'===': permission.module.key}
                }
            }).then(function (filters) {
                $scope.filters = filters;
            });

        };

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


        $scope.create = function () {

            var newPermission = {
                role_id: permission.role,
                module_id: permission.module.key,
                filters: permission.filters,
                actions: []
            };
            // Parse approved actions

            angular.forEach(permissions, function (value, key) {
                if (value) {
                    newPermission.actions.push(key);
                }
            });

            // Parse filters
            // TODO:

            Permission.create(newPermission)
                    .then(function (data) {
                        $uibModalInstance.close(data, true);
                    })
                    .catch(function (response) {
                        var msg = response.data.errors[0];
                        $lcmAlert.error(msg);
                    });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        }

    }

    angular.module('lcma')
            .controller('PermissionNewCtrl', PermissionNewCtrl);
}());
