(function () {
  'use strict';



  function ReportingService(config) {

    var reportingDefaults = {
      applicationUrl: config.REPORTING_BASE_URL,
      autoSizing: 'all',
      secureKey: config.REPORTING_SECURE_KEY
    };

    function create(container, options) {

      if (!'EmbeddedReporting' in window) {
        alert('EmbeddedReporting library not included');
        return;
      }

      options = options || {};

      var settings = angular.extend({}, reportingDefaults, options);

      return EmbeddedReporting.create(container, settings);
    }


    return {
      create: create
    };

  }


  function ReportingDirective($timeout, Report) {
    var count = 0;
    return {
      restrict: 'E',
      replace: true,
      template: '<div></div>',
      scope: {
        report: '@',
        api: '='
      },
      link: function (scope, elem) {

        /*if (!'EmbeddedReporting' in window) {
          alert('EmbeddedReporting library not included');
          return;
        }*/

        count++;

        var id = elem.attr('id');

        if(!id) {
          id = new Date().getTime().toString() + '-' + count;
          elem.attr('id', id);
        }

        scope.$watch('report', function (report) {
          if (report) {
            /*scope.api = ReportingService.create(id, {
              report: report
            });*/                   

            Report.find(report).then(function (response) {
              elem.empty();
              elem.append(response.data);
            });
          }
        });

      }
    };
  }

  function ReportFactory($http, config) {

    function Report() {



    }
    
    Report.find = function (id) {               

        return $http.get(config.REPORTING_API_URL + '/' + id);
        
    };

    return Report;


  }

  angular.module('lcma')
    .service('ReportingService', ReportingService)
    .directive('lcmaReporting', ReportingDirective)
    .factory('Report', ReportFactory);

}());
