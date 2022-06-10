/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('InventoryDocumentManagerCtrl', function ($scope, $timeout, $folder, $uibModalInstance, $entity, $document, $settings, Document, Upload,$lcmAlert, HistoryRefresh) {

      $scope.data = {
        progressStyle: {width: '0px'}
      };

      $scope.title = $settings.title || "Set Document";

      // TODO: This part is not solved properly and requires refactoring
      var url = $settings.url,
        method = 'POST';

      if (!url) {
        url = $document ? '/api/inventory/' + $entity.id +'/document/' + $document.id : '/api/inventory/' + $entity.id + '/document';
        if ($document) {
          method = 'PUT';
        }
      }

      $scope.setFiles = function (files) {
        $timeout(function () {
          var file = files ? files[0] : null;
          $scope.files = files;
          $scope.data.files = {
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath
          };

        });
      };

      $scope.upload = function (form) {

        if (!form.$valid && $scope.data.files.type) {
          return;
        }

        var width = 0;

        function frame() {
          if(width===0){
              $scope.data.progressStyle.width =  '120px';
          }
          if (width >= 95) {
             width = 0;
          } else {
            width++;
           $scope.data.progressStyle['margin-left' ]= width + '%';
          }
      }
      var intervalId = setInterval(frame, 25);

        Upload.upload({
            url: url,
            method: method,
            data: {
                files: $scope.files,
                entity: $entity,
                folder: $folder,
                document: $document,
                description: $scope.data.description,
                contract_type_id: Number.parseInt($scope.data.contract_type_id),
                effective_date: $scope.data.effective_date,
                term: $scope.data.term,
                exp_date: $scope.data.exp_date,
                mrc: $scope.data.mrc,
                nrc: $scope.data.nrc
            }
          })
          .then(function (response) {
            $timeout(function () {
              clearInterval(intervalId);
              HistoryRefresh.refresh();
              $uibModalInstance.close(response.data);
            });
          }, function (response) {
            if (response.status > 0) {
              $lcmAlert.error('Failed to upload file. Try again.')
            }
          }, function (evt) {
            $scope.data.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
           // $scope.data.progressStyle.width = $scope.data.progress + '%';
            if($scope.data.progress==100){
                $scope.progressMessage = "Processing document";
            } else {
                $scope.progressMessage = "Uploading";
            }
          });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


}());
