/**
 * Created by mac on 2/19/16.
 */
/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContactEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentContact, Contact) {

      var contact = $scope.contact = angular.copy($currentContact);

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Contact.update(contact.id, contact)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });
}());
