/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('TicketNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Ticket) {

      var ticket = $scope.ticket = {

      };

      $scope.tickets = [];

      $scope.create = function (form) {
        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Ticket.create(ticket)
          .then(function (result) {
            $uibModalInstance.close(result, true);
          });
      };

      $scope.cancel = function () {
        ticket = $scope.ticket = {

        };
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
