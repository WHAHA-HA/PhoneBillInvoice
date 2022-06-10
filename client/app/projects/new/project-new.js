/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ProjectNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, Project) {

      var project = $scope.project = {

      };

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        Project.create(project)
          .then(function (result) {
            $uibModalInstance.close(result, true);
          });
      };

      $scope.cancel = function () {

        project = $scope.project = {
        };

        $uibModalInstance.dismiss('cancel');
      };
    });


}());
