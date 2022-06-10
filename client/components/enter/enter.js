(function () {
    'use strict';

    angular.module('lcma')
        .directive('lcmaEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown", function (event) {
                    if (event.which === 13 && !event.shiftKey) {
                        scope.$apply(function () {
                            scope.$eval(attrs.lcmaEnter, {event: event});
                        });

                        event.preventDefault();
                        setTimeout(function () {
                            element[0].focus();
                        }, 100);
                    }
                });
            };
        });
})();
