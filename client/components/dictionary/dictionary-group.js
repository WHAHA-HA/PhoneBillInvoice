/**
 *
 */
(function () {
    'use strict';

  function DictionaryGroupPickerDirective(DictionaryGroup) {

    return {
      restrict: 'EA',
      replace:  true,
      scope: {
        model: '=ngModel'
      },
      templateUrl: 'components/dictionary/dictionary-group.html',     
      controller: function ($scope) {
        DictionaryGroup.all().then(function (items) {
          $scope.items = items;
        });
        
        $scope.selection = null;
        $scope.selection = $scope.model;

        function select(){
          $scope.vendors.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          });
        }

        $scope.$watch('selection', function(x){
          $scope.model = x;
        });
      }
    };

  }

  angular.module('lcma')
    .directive('lcmaDictionaryGroupPicker', DictionaryGroupPickerDirective);


}());
