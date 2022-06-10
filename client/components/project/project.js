/**
 *
 */
(function () {
    'use strict';
  function ProjectPickerDirective(Project, $uibModal) {

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        model: '=ngModel'
      },
      templateUrl: 'components/project/project.html',
      controller: function ($scope) {
        $scope.selection = null;
        $scope.selection = $scope.model;

        function select(){
          $scope.projects.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          });
        }

        Project.findAll().then(function (projects) {
          $scope.projects = projects;
        });

        $scope.$watch('selection', function(x){
          $scope.model = x;
        });

        /**
         * Opens add project dialog
         */
        $scope.addItem = function () {
          $uibModal.open({
            templateUrl: 'app/projects/new/project-new.html',
            controller: 'ProjectNewCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window'
          }).result.then(function (project) {
            $scope.projects.push(project);
          });
        };

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaProjectPicker', ProjectPickerDirective);


}());
