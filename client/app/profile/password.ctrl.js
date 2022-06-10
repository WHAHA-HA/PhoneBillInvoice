/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('PasswordUpdateCtrl', function ($scope, $uibModalInstance, $rootScope, $lcmAlert, User) {

      var _this = this;

      $scope.update = function (form) {

        _this.errMsg = '';
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        if (!_this.o_password) {
          _this.errMsg = 'Please provide old password';
        }

        if (!_this.n_password) {
          _this.errMsg = 'Please provide new password';
        }

        if (_this.n_password !== _this.c_password) {
          _this.errMsg = 'Password confirm must match password';
        }

        if (_this.errMsg) {
          return;
        }

        User.password($rootScope.$me.id, {data: {o_pwd: _this.o_password, n_pwd: _this.n_password}})
          .then(function (user) {
            $lcmAlert.success('Password has been changed');
            $uibModalInstance.close(user);
          }, function(error) {

            if (error.data.msg) {
              _this.errMsg = error.data.msg;
            }
            else if (error.data.password && error.data.password.length > 0) {
              _this.errMsg = error.data.password[0];
            }
            else {
              _this.errMsg = 'Internal error';
            }

          });

      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
