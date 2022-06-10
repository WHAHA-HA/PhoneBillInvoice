/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider
        .state('app.recon', {
          url: '/recon',
          views: {
            'main@app' : {
              controller: 'ReconCtrl as ctx',
              templateUrl: 'app/recon/list/recon-list.html'
            }
          }
        })
      ;

    });

}());
