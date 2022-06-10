(function () {
    'use strict';

    function CalendarPositionDirective() {

        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    var el = $("[name="+attrs.name+"]");
                    var dropdown = $(".uib-datepicker-popup, dropdown-menu");
                    var modalContent = $(".modal-content");
                    var modalFooter = $(".modal-footer");
                    var top = el.offset().top - modalContent.offset().top - el.outerHeight();
                    var bottom = modalContent.outerHeight() - top - modalFooter.outerHeight();
                    var diff = bottom - 280/*dropdown.outerHeight()*/;
                    if (diff <= 0) {
                        dropdown.css("margin-top", diff);
                    } 
                });
            }
        };
    }

    angular.module('lcma')
            .directive('lcmaCalendarPosition', CalendarPositionDirective);

}());
