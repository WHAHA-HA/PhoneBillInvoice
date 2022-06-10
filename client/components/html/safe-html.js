/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .filter('newlines', function () {
      return function (text) {
        return text.replace(/\n/g, '<br/>');
      }
    })
    .filter('noHTML', function () {
      return function (text) {
        return text
          .replace(/&/g, '&amp;')
          .replace(/>/g, '&gt;')
          .replace(/</g, '&lt;');
      }
    });


}());
