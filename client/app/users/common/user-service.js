(function () {
  'use strict';

  function UserService(User) {

    function me() {
      return User.me()
        .then(function (response) {
          if (response.data) {
            User.currentUser = response.data;
          }

          return response;
        })
    }

    function currentUser() {
      return User.currentUser;
    }

    return {
      me: me,
      currentUser: currentUser
    }

  }

  angular.module('lcma')
    .service('UserService', UserService);
}());
