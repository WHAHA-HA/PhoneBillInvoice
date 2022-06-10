/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaInvoiceStatusView', function () {

      var statuses = [

        {key: 0, value: 'New', cssClass: 'muted'},
        {key: 10, value: 'New (Rejected)', cssClass: 'muted'},
        {key: 20, value: 'New (Reset)', cssClass: 'muted'},
        {key: 100, value: 'RfA', cssClass: 'info'},
        {key: 200, value: 'Approved', cssClass: 'success'},
        {key: 300, value: 'GL Coded', cssClass: 'warning'}
      ];

      function getStatus(key) {

        for(var i=0;i<statuses.length;i++) {
          var s = statuses[i];
          if(s.key == key) {
            return s;
          }
        }

        return statuses[0];
      }

      return {
        restrict: 'EA',
        scope: {
          model: '=ngModel'
        },
        link: function (scope, elem, attrs) {
          scope.$watch('model', function (val) {
            var status = getStatus(val);
            if(status) {
              elem.html('<span class="text-' + status.cssClass + '">' + status.value + '</span>');
            }
          });
        }
      };


    });

}());
