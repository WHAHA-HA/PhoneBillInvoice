/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ProjectOrderNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, $currentProject, ProjectOrder) {

      var order = $scope.order = {

      };

      $scope.create = function (form) {

        form.$setSubmitted();

        if (!form.$valid) {
          return;
        }

        ProjectOrder.create(order, {params: {project_id: $currentProject.id}})
          .then(function (projectOrder) {
            $uibModalInstance.close(projectOrder);
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
