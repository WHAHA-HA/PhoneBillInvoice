/**
 *
 */
(function () {
    'use strict';

  function NoteListDirective($uibModal) {
    return {

      restrict: 'EA',
      templateUrl: 'components/note/note-list.html',
      replace: true,
      scope: {
        note: '=ngModel',
        onReply: '&'
      },
      link: function (scope) {

        /**
         * Opens view note charges dialog
         */
        scope.viewNoteCharges = function () {

          $uibModal.open({
            templateUrl: 'components/note/note-charges.html',
            controller: 'NoteChargesCtrl',
            backdrop: 'static',
            resolve: {
              charges: function () {
                return scope.note.charges;
              }
            }
          });

        };



        /**
         * Sends reply to note.
         * @param note
         * @param form
         */
        scope.replyToNote = function (note, form) {
          if (!form.$valid) {
            return;
          }

          scope.onReply({note: note});
        };

        // returns firstname + lastname initial letters
        scope.getInitialLetters = function(user) {

          if (!user) {
            return '';
          }

          var firstLetter = ' ';
          var secondLetter = ' ';

          if (user.first_name) {
            firstLetter = user.first_name.charAt(0).toUpperCase();
          }

          if (user.last_name) {
            secondLetter = user.last_name.charAt(0).toUpperCase();
          }

          return firstLetter+secondLetter;
        };


      }

    };
  }

  function NoteChargesCtrl ($scope, $lcmaGrid, $uibModalInstance, charges) {

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
      .addColumn('acct_level_2', "Name")
      .addColumn('chg_class', "Charge Type")
      .addColumn('chg_desc_1', "Charge Desc 1")
      .addColumn('chg_desc_2', "Charge Desc 2")
      .addDateColumn('beg_chg_date', "Ins Date")
      .addColumn('address', "Svc Address")
      .addCurrencyColumn('chg_amt', "Chg Amount")
      .options();



    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  angular.module('lcma')
    .directive('lcmaNoteList', NoteListDirective)
    .controller('NoteChargesCtrl', NoteChargesCtrl);

}());
