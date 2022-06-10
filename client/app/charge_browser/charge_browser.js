/**
 * Created by bear on 2/25/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.charge_browser', {
        url: '/charge_browser',
        views: {
          'main@app' : {
            controller: 'ChargeBrowserCtrl as ctx',
            templateUrl: 'app/charge_browser/list/charge_browser-list.html'
          }
        }
      });
    });
}());
