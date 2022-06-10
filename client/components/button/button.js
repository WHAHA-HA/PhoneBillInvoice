/**
 * Button module represents customized button control.
 */

(function () {
    'use strict';

    angular.module('lcma')
        .directive('lcmaButton', function () {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                template: function (elem, attrs) {
                    return '<button class="btn btn-primary btn-noborder" type="button"><i class="' + attrs.mgIcon + '"></i><span  ng-transclude></span></button>';
                },
                link: function (scope, elem, attrs) {

                    attrs.$observe('loading', function (val) {
                        var icon = elem.find('i');
                        if (val === true || val === 'true') {
                            icon.addClass('fa-spinner fa-spin');
                            elem.attr('disabled', true);
                        }
                        else {
                            icon.removeClass('fa-spinner fa-spin');
                            elem.removeAttr('disabled');

                        }
                    });
                }
            };
        });

}());
