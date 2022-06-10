/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('NoteNewCtrl', function ($scope, $lcmaGrid, $uibModalInstance, charges, entityId, entityType, Note) {

      $scope.note = {};
      $scope.charges = charges;


      /**
       * Charges grid definition
       */
      $scope.chargesGrid = $lcmaGrid({
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        enableFiltering: false,
        data: charges
      })
        .addColumn('acct_level_2', "Subaccount")
        .addColumn('chg_class', "Charge Type")
        .addColumn('chg_desc_1', "Charge Desc 1")
        .addColumn('chg_desc_2', "Charge Desc 2")
        .addDateColumn('beg_chg_date', "Install Date")
        .addColumn('address', "Service Address")
        .addCurrencyColumn('chg_amt', "Charge Amount")
        .options();


      $scope.create = function (form) {

        form.$setSubmitted();

        if(!form.$valid) {
          return;
        }

        Note.create({
          entity_id: entityId,
          entity_type: entityType,
          content: $scope.note.content,
          charges: charges
        }).then(function (note) {
          $uibModalInstance.close(note);
        });


      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
