(function () {
    'use strict';

    function Page() {

        var _page = {
            title: '',
            sidebar: true,
            bodyClass: ''
        };

        this.$get = function () {

            _page.setTitle = function (title) {
                _page.title = title;
                return _page;
            };

            _page.getTitle = function () {
                return _page.title;
            };

            _page.setBodyClass = function (cls) {
                _page.bodyClass = cls;
                return _page;
            };

            _page.getBodyClass = function () {
                return _page.bodyClass;
            };

            _page.showSidebar = function (flag) {
                _page.sidebar = flag;
                return _page;
            };

            _page.isLargeScreen = function () {

                var mq = window.matchMedia("(min-width: 1200px)");
                return mq.matches;
            };

            return _page;
        };
    }

    angular.module('lcma')
        .provider('$lcmaPage', Page);
}());
