/**
 *
 */
(function () {
    'use strict';


  /***********************************************************************************************************************************************
   * NG-REPEAT WHILE
   * OWNERSHIP: https://github.com/ktstowell/ng-repeat-while
   ***********************************************************************************************************************************************
   * @description Will print DOM on the page as ng-repeat while the provided expression evaluates to true.
   */
  angular.module('lcma').directive('ngRepeatWhile', function($parse, $compile) {

    return  {
      restrict: 'A',
      scope: true,
      link: function ($scope, $element, $attrs) {

        // Expression to be evaluated - if true,
        // The first $parse is to solve if an object is provided the results in a string expression
        // so the second time it is $parsed in checkExpression, it will actually evaluate the statement.
        var expression = $parse($attrs.ngRepeatWhile)($scope);

        $scope.$watch($attrs.ngRepeatWhile, function(newVal, oldVal) {
          if(newVal !== oldVal) {
            // evaluate
            expression = $parse($attrs.ngRepeatWhile)($scope);
            // recurse
            checkExpression();
          }
        });

        // Expose a 'current iteration step' property
        $scope.$index = 0;
        $scope.includes = {};
        $scope.ngRepeatEvaluated = false;

        // Remove ng-while attribute so the clone wont have it
        // and create infinite awesomeness when $compiling.
        $element.removeAttr('ng-repeat-while');
        var element = $element.clone();
        // Get the parent for the provided element
        var parent = $element[0].parentElement;

        if(!$scope.ngRepeatEvaluated) {
          // Append our comment:
          var comment = document.createComment('ngRepeatWhile: '+expression);
          parent.appendChild(comment);

          // I'm sure this could be simplified, but I'm not that great at the regexificationing.
          var includes = expression.match(/[\$]\b[a-zA-Z][^0-9><\s+\/\*\-]*\b|\b[a-zA-Z][^0-9><\s+\/\*\-]*\b/g);

          for(var i=0; i<includes.length; i++) {
            var obj = includes[i].split('.')[0];
            $scope.includes[obj] = $parse(obj)($scope);

            $scope.$watch(obj, function(newVal, oldVal) {
              if(!$scope.ngRepeatEvaluated || newVal !== oldVal) {
                checkExpression();

                $scope.ngRepeatEvaluated = true;
              }
            });
          }
        }

        function checkExpression() {

          if($parse(expression)($scope)) {

            // Create a new scope for our sub DOM.
            var scope = $scope.$new(true);

            // Copy scope items to teh new scope
            for(var include in $scope.includes) {
              scope[include] = $scope.includes[include];
            }

            // Apply global to local
            scope.$index = $scope.$index;

            $compile(angular.element(element))(scope, function(compEl) {
              // Add new DOM
              parent.appendChild(compEl[0]);
              // Increment global counter
              $scope.$index++;
              // We remove the first one because we need to evaluate the expressions from a fresh start
              $element.remove();
              // Recurse
              checkExpression();
            });
          }
        }
      }
    };
  });

}());
