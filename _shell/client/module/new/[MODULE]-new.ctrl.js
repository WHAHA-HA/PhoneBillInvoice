/**
 *
 */
(function () {
  'use strict';

  function ModelNewController($scope, $uibModalInstance) {



    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
  angular.module('lcma')
    .controller('[MODULE]NewCtrl', ModelNewController);


}());
