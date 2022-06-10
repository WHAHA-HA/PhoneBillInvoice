/**
 *
 */
(function () {
  'use strict';

  function PagerProvider() {

    var pagerDefaults = {
      total: 0,
      page: 1,
      size: 10
    };

    this.extendDefaults = function (config) {
      if (config) {
        angular.extend(pagerDefaults, config);
      }
    };

    this.$get = function () {

      var pager = {};

      var totalValue = 1;
      Object.defineProperty(pager, 'total', {
        get: function () {
          return totalValue;
        },
        set: function (newValue) {

          totalValue = newValue || 1;
        },
        enumerable: true,
        configurable: true
      });

      return function (config) {
        config = config || {};

        pager.size = config.size || pagerDefaults.size;
        pager.page = config.page || pagerDefaults.page;
        pager.total = config.total || pagerDefaults.total;

        /**
         * Sets pager page size.
         * @param size Size of the page.
         */
        pager.setSize = function (size) {

          pager.page = 1;

          if (pager.size !== size) {
            pager.size = size;
          }

          pager.go();

        };

        /**
         * Gets total pages count.
         * @returns {*}
         */
        pager.totalPages = function () {
          if (pager.total) {
            return Math.ceil(pager.total / pager.size);
          }

          return pager.total;
        };

        /**
         * Gets list of pager pages ([1,2,3,4]) .
         * @returns {Array}
         */
        pager.pages = function () {
          var arr = [], p = 1;
          while (p <= pager.totalPages()) {
            arr.push(p);
            p++;
          }
          return arr;
        };

        /**
         * Gets records from value regarding to current pager state.
         * @returns {number}
         */
        pager.from = function () {
          return ((pager.page - 1) * pager.size) + 1;
        };

        /**
         * Gets records to value regarding to current pager state.
         * @returns {number}
         */
        pager.to = function () {
          var all = pager.page * pager.size;
          return all > pager.total ? pager.total : all;
        };

        /**
         * Moves pager to next page if possible.
         */
        pager.next = function () {
          if (pager.canNext()) {
            pager.page++;
            pager.go();
          }
        };

        /**
         * Moves pager to previous page if possible.
         */
        pager.prev = function () {
          if (pager.canPrev()) {
            pager.page--;
            pager.go();
          }
        };

        /**
         * Returns a value indicating if pager has next page.
         * @returns {boolean}
         */
        pager.canNext = function () {
          return pager.page < pager.totalPages();
        };

        /**
         * Returns a value indicating if pager has previous page.
         * @returns {boolean}
         */
        pager.canPrev = function () {
          return pager.page > 1;
        };

        /**
         * Goes to specified page and fire "onGo" callback if defined.
         * @param page
         */
        pager.go = function (page) {
          if (page) {
            pager.page = page;
          }

          if (config.onGo) {
            config.onGo();
          }

        };

        return pager;

      }
    };
  }

  function PagerDirective() {
    return {

      restrict: 'EA',
      replace: true,
      templateUrl: 'components/pager/pager.html',
      scope: {
        pager: '=ngModel'
      },

    };
  }

  function PagerSizeSwitchDirective() {
    return {

      restrict: 'EA',
      replace: true,
      templateUrl: 'components/pager/pager-size-switch.html',
      scope: {
        pager: '=ngModel'
      }

    };
  }

  function PagerInfoDirective() {
    return {

      restrict: 'EA',
      replace: true,
      templateUrl: 'components/pager/pager-info.html',
      scope: {
        pager: '=ngModel'
      }

    };
  }

  angular.module('lcma')
    .provider('$lcmaPager', PagerProvider)
    .directive('lcmaPager', PagerDirective)
    .directive('lcmaPagerSizeSwitch', PagerSizeSwitchDirective)
    .directive('lcmaPagerInfo', PagerInfoDirective);

}());
