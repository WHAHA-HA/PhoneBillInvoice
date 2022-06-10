/**
 *
 */
(function () {
  'use strict';

  function ContentFilterNewCtrl($scope, $uibModalInstance, $modules, ContentFilter) {

    $scope.modules = $modules;
    var filter = $scope.filter = {
      context: {},
      module: null
    };
    $scope.selected = -1;

    $scope.select = function (index) {
      $scope.selected = index;
    };


    $scope.create = function () {

      var newFilter = {
        module_id: filter.module.key,
        title: filter.title,
        property_name: filter.context.property.name,
        operator: filter.context.operator.value,
        type: filter.context.property.type,
        value: angular.isObject(filter.context.value) ? JSON.stringify(filter.context.value) : filter.context.value
      };

      ContentFilter.create(newFilter)
        .then(function (filter) {
          $uibModalInstance.close(filter, true);
        });

    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

  }

  angular.module('lcma')
    .controller('ContentFilterNewCtrl', ContentFilterNewCtrl);

}());
