/**
 *
 */
(function () {
  'use strict';

  function AuthService(Auth, User, $lcmaAuthToken) {

    function login(username, password) {

      return Auth.login({
          data: {
            username: username,
            password: password
          }
        })
        .then(function (response) {
          $lcmaAuthToken.set(response.data.token);
          return User.me().then(function (user) {
            User.currentUser = user;
            return response;
          });
        })

    }

    return {
      login: login
    }

  }

  /*
   *
   * */

  angular.module('lcma')
    .service('AuthService', AuthService);


}());
