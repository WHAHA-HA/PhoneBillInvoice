/**
 *
 */
(function () {
    'use strict';

angular.module('lcma')
  .config(function ($stateProvider) {

    $stateProvider
      .state('app.errorForbidden', {
        url: '/forbidden',
        views: {
          "main@app": {
            templateUrl: 'app/errors/forbidden.html'
          }
        }
      })
      .state('app.pageNotFound', {
        url: '/pageNotFound',
        views: {
          "main@app": {
            templateUrl: 'app/errors/404.html'
          }
        }
      });

  })

}());
