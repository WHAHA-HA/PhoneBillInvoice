(function () {
    'use strict';
    function PermissionServiceDirective(PermissionService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                var permissions = attrs.lcmaCheckPermissions.split("@");
                if (attrs.lcmaCheckPermissions !== ''  && permissions.length===2) {
                    PermissionService.isAllowed(permissions[0], permissions[1]).then(function(value){
                        if(!value){
                            elem.remove();
                        }
                    }, function(rejected){
                        elem.remove();
                    });
                } else {
                    elem.remove();
                }
            }
        };
    }

  angular.module('lcma')
    .directive('lcmaCheckPermissions', PermissionServiceDirective);
    
}());