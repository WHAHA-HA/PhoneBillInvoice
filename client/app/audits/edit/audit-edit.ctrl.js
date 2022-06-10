/**
 *
 */
(function () {
  'use strict';

  function AuditEditCtrl($scope, $lcmaPage, $lcmAlert, $lcmaGrid, Audit, Note,
                             $currentAudit, $uibModal, $lcmaDialog) {

    var _this = this;

    _this.audit = $currentAudit;
    _this.selection =null;

    //Audit notes
    _this.notes = [];

    $lcmaPage.setTitle('Audit: ' + _this.audit.id);


    var invoiceChargesGrid = _this.invoiceChargesGrid = $lcmaGrid({
      enableFiltering: false,
      enableSorting: false,
      onRegisterApi: function (api) {
        _this.gridApi = api;
      }

    })
      .addCommandColumn('remove', ' ', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeSite(row.entity)"><i class="fa fa-trash"></i></a>',
      })
      .addColumn('site_id', 'Site ID', {
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.site_id}}</div>'
      })
      .addColumn('vendor.name', 'Vendor')
      .addColumn('building.name', 'Building')
      .addColumn('type.value', 'Site Type')
      .addColumn('address1', 'Address1')
      .addColumn('address2', 'Address2')
      .addColumn('address3', 'Address3')
      .addColumn('city_state_zip', 'City/State/Zip', {
        enableFiltering: true,
        width: 180,
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.city}}, {{row.entity.state}}, {{row.entity.zip}}</div>'
      })
      .options();


    _this.updateAudit = function (form) {

      form.$setSubmitted();

      if(!form.$valid) {
        return;
      }


      Audit.update(_this.audit.id, _this.audit).then(function (audit) {
        $lcmAlert.success('Audit info has been updated');
      })

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
            return _this.audit.id
          },
          entityType: function () {
            return 'audit'
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
        entity_id: _this.audit.id,
        parent_id: note.id,
        entity_type: 'audit',
        content: note.$reply.content
      }).then(function (newNote) {
        delete note.$reply;

        if (!note.notes) {
          note.notes = [];
        }
        note.notes.push(newNote);
      });
    };

    /**
     * Queries : called as init function
     */
    _this.query = function() {

      invoiceChargesGrid = _this.audit.invoiceCharges;

      // Get notes for the inventory
      _this.notesQuery = {
        where: {
          entity_id: {'==': _this.audit.id},
          entity_type: {'==': 'audit'}
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
    .controller('AuditEditCtrl', AuditEditCtrl)

}());
