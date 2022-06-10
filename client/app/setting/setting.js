/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.setting', {
        url: '/setting',
        views: {
          'main@app' : {
            controller: 'SettingCtrl as ctx',
            templateUrl: 'app/setting/list/setting-list.html'
          }
        }
      });

    });

}());
