/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaUserPopOverToggle', function ($timeout) {

      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          var timer;

          elem.addClass('lcma-popover-toggle')
            .bind('mouseenter', function () {
              timer = $timeout(function () {
                elem.addClass('on');
              }, 200);
            })
            .bind('mouseleave', function () {
              $timeout.cancel(timer);
              elem.removeClass('on');
            });

        }
      };
    })
    .directive('lcmaUserPopOver', function () {

      return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'components/user-popover/user-popover.html',
        scope: {
          user: '=ngModel'
        },
        link: function (scope, elem, attrs) {

          elem.addClass('lcma-popover');

          // returns firstname + lastname initial letters
          scope.getInitialLetters = function() {

            if (!scope.user) {
              return '';
            }

            var firstLetter = ' ';
            var secondLetter = ' ';

            if (scope.user.first_name) {
              firstLetter = scope.user.first_name.charAt(0).toUpperCase();
            }

            if (scope.user.last_name) {
              secondLetter = scope.user.last_name.charAt(0).toUpperCase();
            }

            return firstLetter+secondLetter;
          };

        }
      };
    })
}());
