/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.glstrings', {
        url: '/glstrings',
        views: {
          'main@app' : {
            controller: 'GLStringListCtrl as ctx',
            templateUrl: 'app/gl_strings/list/gl_string-list.html'
          }
        }
      });
    });


}());
