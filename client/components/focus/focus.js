/**
 * Created by andrejkaurin on 8/19/15.
 */
(function () {
  'use strict';

  function FocusDirective() {
    return function (scope, elem, attr) {



      var tabindex = elem.attr('tabindex');
      if(!tabindex) {
        elem.attr('tabindex', -1);
      }
      scope.$on('lcmaFocusOn', function (e, name) {
        if (name === attr.lcmaFocusOn) {
          elem[0].focus();
        }
      });
    };
  }

  function FocusFactory($timeout, $rootScope) {
    return function (name) {
      $timeout(function () {
        $rootScope.$broadcast('lcmaFocusOn', name);
      });
    };
  }

  angular.module('lcma')
    .directive('lcmaFocusOn', FocusDirective)
    .factory('$lcmaFocus', FocusFactory);

}());
