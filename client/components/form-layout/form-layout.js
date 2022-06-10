/**
 *
 */
(function () {
  'use strict';

  function FormLayoutDirective() {

    return {
      restrict: 'E',
      transclude: true,
      //controllerAs: 'ctx',
      replace: true,
      template: '<div class="form-layout row" ng-transclude></div>',
      link: function (scope, elem, attrs) {

        var columns = 3,
          className = "",
          ref = 12;

        function applySizes() {

          var colSize = parseInt(ref / columns);

          elem.children().each(function (index, group) {

            var groupElement = angular.element(group);
            groupElement.removeClass(className);
            className = "col-sm-" + colSize;
            groupElement.addClass(className);
          });

        }


        attrs.$observe('columns', function (cols) {
          if (columns !== cols) {
            columns = cols;
            applySizes();
          }
        });


      },
      controller: function ($scope, $attrs) {

      }
    }
  }

  function FormGroupDirective() {
    return {
      restrict: 'E',
      require: ['^lcmaFormLayout'],
      transclude: true,
      replace: true,
      template: '<div class="form-layout-group clearfix" ng-transclude></div>',
      link: function (scope, elem, attrs, ctrls) {

        var labelSize = 5,
          ref = 12,
          labelClassName = "col-sm-5",
          containerClassName = "col-sm-7";

        attrs.$observe('labelSize', function (s) {
          if (labelSize !== s) {
            labelSize = s;
            applySizes();
          }
        });

        function applySizes() {

          var containerSize = parseInt(ref - labelSize);

          elem.children().each(function (index, item) {

            var el = angular.element(item);

            if (el.hasClass('control-label')) {
              el.removeClass(labelClassName);
              labelClassName = "col-sm-" + labelSize;
              el.addClass(labelClassName);
            }
            else if (el.hasClass('control-container')) {
              el.removeClass(containerClassName);
              containerClassName = "col-sm-" + containerSize;
              el.addClass(containerClassName);
            }

          });

        }

      }
    }
  }

  function FormLabelDirective() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<label class="col-sm-5 control-label" ng-transclude></label>',
      link: function (scope, elem, attrs) {


      }
    }
  }

  function ControlContainerDirective() {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div class="col-sm-7 control-container" ng-transclude></div>',
      link: function (scope, elem, attrs) {


      }
    }
  }

  angular.module('lcma')
    .directive('lcmaFormLayout', FormLayoutDirective)
    .directive('lcmaFormGroup', FormGroupDirective)
    .directive('lcmaFormLabel', FormLabelDirective)
    .directive('lcmaControlContainer', ControlContainerDirective)
  ;

}());
