/**
 * Created by bear on 7/7/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .factory('EquipmentInterface', function (DS) {

      return DS.defineResource({
        name: 'equipment_interface'
      });
    });

}());
