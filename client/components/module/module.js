/**
 *
 */
(function () {
  'use strict';

  function ModulePickerDirective(AppModule) {

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        model: '=ngModel',
        onChange: '&'
      },
      templateUrl: 'components/module/module.html',
      controller: function ($scope) {
        $scope.selection = null;
        $scope.selection = $scope.model;

        function select(){
          $scope.modules.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          })
        }

        AppModule.findAll().then(function (modules) {
          $scope.modules = modules;

          //select();
        }); 

        $scope.$watch('selection', function(x){
          $scope.model = x;
          $scope.onChange({item:x});
        });

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaModulePicker', ModulePickerDirective);


}());
