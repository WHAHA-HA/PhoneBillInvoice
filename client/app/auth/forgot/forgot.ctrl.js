/**
 *
 */
(function () {
  'use strict';

  function ForgotCtrl(Auth, $lcmaAuthToken) {
    var _this = this;

    /**
     * Holds authentication model values.
     * @type {{}}
     */
    var auth = _this.auth = {};

    /**
     * Initiates password reset
     * @param form Form to be submitted.
     */
    _this.resetPassword = function (form) {
      if (!form.$valid) {
        form.$submitted = true;
        return;
      }

      Auth.sendResetInstructions({
          data: {
            email: auth.email
          }
        })
        .then(function (response) {
          _this.success = {msg: "Check your email for reset instructions."};
          _this.error = null;
        })
        .catch(function (response) {
          _this.error = response.data.error;
          _this.success = null;
        });
    };
  }

  angular.module('lcma')
    .controller('ForgotCtrl', ForgotCtrl);

}());
