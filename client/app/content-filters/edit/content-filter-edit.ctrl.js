/**
 *
 */
(function () {
  'use strict';

  function ContentFilterEditCtrl($scope, $uibModalInstance, $modules, $currentFilter, ContentFilter) {

    var modules = $scope.modules = $modules;
    var filter = $scope.filter = angular.copy($currentFilter);

    function findProperty(key, name) {
      var result = modules.filter(function (x) {
        return x.key === key;
      });

      var module = result.length ? result[0] : null;

      if(module) {
        result = module.properties.filter(function (x) {
          return x.name === name;
        });

        return result.length ? result[0] : null;
      }
    }

    var property = findProperty(filter.module.key, filter.property_name);

    var filterContext = $scope.filterContext = {
      property: property,
      operator: filter.operator,
      value: filter.value
    };


    $scope.update = function () {
      ContentFilter.update(filter.id,{
          id: filter.id,
          module_id: filter.module.key,
          title: filter.title,
          property_name: filterContext.property.name,
          operator: filterContext.operator.value,
          type: filterContext.property.type,
          value: angular.isString(filterContext.value) ? filterContext.value : JSON.stringify(filterContext.value)
        })
        .then(function (filter) {
          $uibModalInstance.close(filter);
        });

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    }

  }

  angular.module('lcma')
    .controller('ContentFilterEditCtrl', ContentFilterEditCtrl);
}());
