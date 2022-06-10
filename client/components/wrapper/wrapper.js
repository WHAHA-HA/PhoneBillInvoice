/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma').directive('lcmaWrapper', function($controller) {

  var linker = function(scope, element, attrs) {
    var locals = {
      $scope: scope,
      $element: element,
      $attrs: attrs,
      $transclude: undefined,
      $uibModalInstance: {
        close: function(data, create) {
          scope.onChange({data: data, create: create});
        },
        dismiss: function() {
          scope.onDismiss({create: true});
        }
      }
    };

    scope.$watch('resolve', function(resolve) {
      //var obj = scope.$eval(resolve);
      angular.extend(locals, resolve);
      var ctrl = $controller(attrs.controller, locals);
      scope.ctx = ctrl;
      element.data('$Controller', ctrl);
    });

  };

  return {
    scope: {
      resolve: '=',
      onChange: '&',
      onDismiss: '&'
    },
    templateUrl: function(elem, attrs) {
      return attrs.templateUrl || '';
    },
    restrict: "EA",
    replace: true,
    link: linker
  };

});

}());
