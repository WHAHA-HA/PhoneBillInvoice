/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('HistoryContractCtrl', function ($scope, $uibModal, $lcmAlert, Contract) {

      $scope.openSection = function (entry) {

        $uibModal.open({
          templateUrl: 'app/contracts/section-edit/section-edit.html',
          controller: 'ContractSectionEditCtrl',
          backdrop: 'static',
          resolve: {
            $currentSection: function () {
              return entry.meta_data;
            }
          }
        }).result.then(function (data) {
          //angular.extend(section, data);
          $lcmAlert.success('Contract section info has been updated');
        });
      };

      $scope.readDocument = function (doc, open) {
        Contract.getAdapter('http').GET('/api/document/' + doc.id + '/download/contracts', {
          responseType: 'arraybuffer'
        })
          .then(function (response) {
            var blob = new Blob([response.data], {type: doc.type});
            var objectUrl = URL.createObjectURL(blob);
            if(open === true){
              window.open(objectUrl);
            } else {
              var save = document.createElement('a');
              save.href = objectUrl;
              save.target = '_blank';
              save.download = doc.path;
              var event = document.createEvent("MouseEvents");
              event.initMouseEvent(
                "click", true, false, window, 0, 0, 0, 0, 0
                , false, false, false, false, 0, null
              );
              save.dispatchEvent(event);
            }
          }, function(err){
            $lcmAlert.error('Contract document is not available.');
          });
      };

    });


}());
