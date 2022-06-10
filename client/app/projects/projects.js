/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider
        .state('app.projects', {
          url: '/projects',
          views: {
            'main@app' : {
              controller: 'ProjectsCtrl as ctx',
              templateUrl: 'app/projects/list/project-list.html'
            }
          }
        })
        .state('app.projectEdit', {
          url: '/projects/:id/edit',
          resolve: {
            $currentProject: function ($stateParams, Project) {
              return Project.find($stateParams.id);
            }
          },
          views: {
            'main@app' : {
              controller: 'ProjectEditCtrl as ctx',
              templateUrl: function() {
                return 'app/projects/edit/project-edit.html';
              }
            }
          }
        })
      ;

    });

}());
