/**
 *
 */
(function () {
  'use strict';
  'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {
      $stateProvider
        .state('anonymous.login', {
          url: '/login',
          views: {
            'main@anonymous': {
              templateUrl: 'app/auth/login/login.html',
              controller: 'LoginCtrl as ctx'
            }
          }

        })
        .state('anonymous.forgot', {
          url: '/forgot',
         views: {
           'main@anonymous': {
             templateUrl: 'app/auth/forgot/forgot.html',
             controller: 'ForgotCtrl as ctx'
           }
         }
        })
        .state('anonymous.reset', {
          url: '/reset',
         views: {
           'main@anonymous': {
             templateUrl: 'app/auth/reset/reset.html',
             controller: 'ResetPasswordCtrl as ctx'
           }
         }
        })
        .state('logout', {
          url: '/logout',
          onEnter: function ($lcmaAuthToken, $state, User) {
            $lcmaAuthToken.remove();
            User.currentUser = null;
            $state.go('anonymous.login');
          }
        });
    });


}());
