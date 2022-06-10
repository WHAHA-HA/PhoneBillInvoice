/**
 *
 */
(function () {
  'use strict';

  function ResetPasswordCtrl(Auth, $lcmaAuthToken) {
    var _this = this;

    /**
     * Holds authentication model values.
     * @type {{}}
     */
    var auth = _this.auth = {};

    /**
     * Initiates password reset.
     * @param form Form to be submitted.
     */
    _this.resetPassword = function (form) {
      if (!form.$valid) {
        form.$submitted = true;
        return;
      }

      Auth.resetPassword({
          data: {
            token: auth.token,
            password: auth.password
          }
        })
        .then(function (response) {
          _this.success = {msg: "You have successfully changed you password."};
          _this.error = null;
        })
        .catch(function (response) {
          _this.error = response.data.error;
          _this.success = null;
        });
    };
  }

  angular.module('lcma')
    .controller('ResetPasswordCtrl', ResetPasswordCtrl);

}());
