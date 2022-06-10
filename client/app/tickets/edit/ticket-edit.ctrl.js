/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('TicketEditCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentTicket, Ticket) {

      var ticket = $scope.ticket = angular.copy($currentTicket);

      $scope.update = function (form) {

        if (!form.$valid) {
          return;
        }

        Ticket.update(ticket.id, ticket)
          .then(function (result) {
            $uibModalInstance.close(result);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
