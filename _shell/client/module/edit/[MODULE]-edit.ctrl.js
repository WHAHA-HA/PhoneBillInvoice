/**
 *
 */
(function () {
  'use strict';

  function ModelEditController($scope, $uibModalInstance) {



    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
  angular.module('lcma')
    .controller('[MODULE]EditCtrl', ModelEditController);


}());
