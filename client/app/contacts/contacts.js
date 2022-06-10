/**
 * Created by albin on 2/19/16.
 */
(function () {
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider.state('app.contacts', {
        url: '/contacts',
        views: {
          'main@app' : {
            controller: 'ContactsCtrl as ctx',
            templateUrl: 'app/contacts/list/contact-list.html'
          }
        }
      });
    });
}());
