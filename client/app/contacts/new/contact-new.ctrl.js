/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContactNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Contact) {

      var contact = $scope.contact = {

      };

      $scope.sites = [];

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Contact.create(contact)
          .then(function (result) {
            $uibModalInstance.close(result,  true);
          });
      };

      $scope.cancel = function () {
        contact = $scope.contact = {

        };
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
