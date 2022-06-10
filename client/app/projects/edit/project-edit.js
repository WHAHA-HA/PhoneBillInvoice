/**
 *
 */
(function () {
    'use strict';

  function ProjectEditCtrl($scope, $lcmaPage, $lcmAlert, $lcmaGrid, $lcmaDialog, $currentProject, $uibModal, Project, Note, ProjectOrder, $uibModalInstance) {


    var _this = this;

    _this.project = angular.copy($currentProject);
    _this.selection =null;

    //Mobile Device notes
    _this.notes = [];
    _this.history=[];

    $lcmaPage.setTitle('Project: ' + _this.project.id);

    var ordersGrid = _this.ordersGrid = $lcmaGrid({
      enableFiltering: false,
      enableSorting: false,
      onRegisterApi: function (api) {
        _this.gridApi = api;
      }

    })
      .addCommandColumn('remove', 'remove', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeOrderInfo(row.entity)"><i class="fa fa-trash"></i></a>',
      })
      .addColumn('order_id', 'Order ID')
      .addColumn('svc_item_id', 'Svc Item #')
      .addColumn('svc_item_type.value', 'Svc Item Type')
      .addDateColumn('proj_comp_date', 'Proj Comp Date')
      .addColumn('status.value', 'Status')
      .addColumn('bill_start_end', 'Bill Start / End Date', {
        enableFiltering: true,
        width: 180,
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.bill_start_date |  date:"MM/dd/yyyy" }} / {{row.entity.bill_end_date |  date:"MM/dd/yyyy"}}</div>'
      })
      .options();

    _this.updateProject = function (form) {

      form.$setSubmitted();

      if(!form.$valid) {
        return;
      }

      Project.update(_this.project.id, _this.project).then(function (project) {
        $currentProject = project;
        $lcmAlert.success('Project info has been updated');
      })

    };

    /**
     * add record to project_orders table
     * @param order
     */
    _this.addOrderInfo = function (order) {

      $uibModal.open({
        templateUrl: 'app/projects/new/project-order-new.html',
        controller: 'ProjectOrderNewCtrl',
        windowClass: 'app-modal-window',
        backdrop: 'static',
        resolve: {
          $currentProject: function () {
            return _this.project;
          }
        }
      })
        .result.then(function (order) {
          $lcmAlert.success('Project info has been added.');

          _this.project.project_orders = _this.project.project_orders || [];
          _this.project.project_orders.push(order);
          ordersGrid.data = _this.project.project_orders;
        });
    };

    _this.removeOrderInfo = $scope.removeOrderInfo = function (orderInfo) {

      $lcmaDialog.confirm({
        titleText: 'Please confirm',
        bodyText: 'Are you sure you want to permanently remove this Order Info?'
      }).result.then(function () {
        ProjectOrder.destroy(orderInfo, {params: {project_id: _this.project.id}})
          .then(function () {
            _.remove(_this.project.project_orders, function(ele) {
              return ele.id ===orderInfo.id;
            });
          });
      });

    };


    /**
     * Opens add note dialog
     */
    _this.addNote = function () {

      $uibModal.open({
        templateUrl: 'app/note/new/note-new.html',
        controller: 'NoteNewCtrl',
        backdrop: 'static',
        resolve: {
          entityId: function () {
            return _this.project.id
          },
          entityType: function () {
            return 'project'
          },
          charges: function () {
            return [];
          }
        }
      })
        .result.then(function (newNote) {
          _this.notes.push(newNote);
          $lcmAlert.success('Note has been created');
        }, function () {


        });
    };

    /**
     * Sends reply to note.
     * @param note
     */
    _this.onNoteReply = function (note) {
      Note.create({
        entity_id: _this.project.id,
        parent_id: note.id,
        entity_type: 'project',
        content: note.$reply.content
      }).then(function (newNote) {
        delete note.$reply;

        if (!note.notes) {
          note.notes = [];
        }
        note.notes.push(newNote);
      });
    };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

    /**
     * Queries : called as init function
     */
    _this.query = function() {

      ordersGrid.data = _this.project.project_orders;

      // Get notes for the project
      _this.notesQuery = {
        where: {
          entity_id: {'==': _this.project.id},
          entity_type: {'==': 'project'}
        }
      };

      Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
        _this.notes = notes;
      });


    };

    // calling initial function
    _this.query();
  }

  angular.module('lcma')
    .controller('ProjectEditCtrl', ProjectEditCtrl)

}());
