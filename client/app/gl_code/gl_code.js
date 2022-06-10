/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.glcode', {
        url: '/glcode',
        views: {
          'main@app' : {
            controller: 'GLCodesListCtrl as ctx',
            templateUrl: 'app/gl_code/list/gl_code-list.html'
          }
        }
      });
    });


}());
