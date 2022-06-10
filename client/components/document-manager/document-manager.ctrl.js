/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContractDocumentManagerCtrl', function ($scope, $timeout, $lcmAlert, $uibModalInstance, $currentContract, $settings, Contract, Upload, HistoryRefresh) {

      $scope.data = {
        progressStyle: {width: '0px'}
      };
      
      $scope.noteHidden = true;
      
      $scope.title = $settings.title || "Set Document";

      // TODO: This part is not solved properly and requires refactoring
      var url = $settings.url || '/api/contract/' + $currentContract.id + '/document';

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
            method: "POST",
            data: {
              files: $scope.files,
              contract: $currentContract
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
    })
    .controller('EntityDocumentManagerCtrl', function ($scope, $timeout, $folder, $uibModalInstance, $entity, $document, $settings, Document, Upload,$lcmAlert, HistoryRefresh) {

      $scope.data = {
        progressStyle: {width: '0px'}
      };
      

      // TODO: This part is not solved properly and requires refactoring
      var url = $settings.url,
        method = 'POST';

      if (!url) {
        url = $document ? '/api/document/' + $document.id : '/api/document/';
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
              description: $scope.data.description
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
