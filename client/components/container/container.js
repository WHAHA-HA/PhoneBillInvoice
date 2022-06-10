/**
 *
 */
(function () {
  'use strict';

  function ContainerDirective() {

    return {
      restrict: 'E',
      transclude: true,
      //controllerAs: 'ctx',
      replace: true,
      template: '<div class="lcma-container" ng-transclude></div>',
      link: function (scope, elem, attrs) {

        var columns = [4,4,4],
          className = "",
          ref = 12;

        function applySizes() {

          var colSize = parseInt(ref / columns);

          elem.children().each(function (index, group) {

            var groupElement = angular.element(group);

            if(index >= columns.length || !groupElement.has('.lcma-container-group')) {
              return;
            };

            groupElement.removeClass(className);
            className = "col-sm-" + columns[index];
            groupElement.removeClass('col-sm1 col-sm-2 col-sm-3 col-sm-4 col-sm-6 col-sm-7 col-sm-8 col-sm-9 col-sm-10 col-sm-11 col-sm-12');
            groupElement.addClass(className);
          });

        }


        attrs.$observe('columns', function (cols) {
          cols = scope.$eval(cols);
          if (columns !== cols) {
            columns = cols;
            applySizes();
          }
        });

        applySizes();

      },
      controller: function ($scope, $attrs) {

      }
    }
  }

  function ContainerGroupDirective() {
    return {
      restrict: 'E',
      require: ['^lcmaContainer'],
      transclude: true,
      replace: true,
      template: '<div class="lcma-container-group clearfix" ng-transclude></div>',
      link: function (scope, elem, attrs, ctrls) {


      }
    }
  }

  angular.module('lcma')
    .directive('lcmaContainer', ContainerDirective)
    .directive('lcmaContainerGroup', ContainerGroupDirective)
  ;

}());
