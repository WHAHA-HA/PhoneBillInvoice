/**
 */
(function () {
  'use strict';


  angular.module('lcma')
    .provider('$lcmaDate', function () {


      this.$get = function () {

        var instance = moment;

        return instance;
      };

    })

}());
