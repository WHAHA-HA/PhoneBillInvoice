/**
 * Created by bear on 2/22/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.equipments', {
        url: '/equipments',
        views: {
          'main@app' : {
            controller: 'EquipmentsCtrl as ctx',
            templateUrl: 'app/equipments/list/equipment-list.html'
          }
        }
      });
    });
}());
