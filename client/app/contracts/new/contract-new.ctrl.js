/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .controller('ContractNewCtrl', function ($scope, $timeout, $lcmAlert, $uibModalInstance, Contract, Vendor, Upload) {

      var contract = $scope.contract = {
/*        committed_value: 23000,
        company_name: "My company",
        company_sign_date: "2016-01-20",
        description: "Some description",
        effective_date: "2016-01-12",
        vendor_sign_date: "2016-01-12",
        vendor_id: 1,
        //master_id: "",
        name: "Single contract",
        term_months: 36,
        termination_date: "2016-01-25",*/
        type: "1",
        status: 0
      };

      var data = $scope.data = {
        progressStyle: {width: '0px'}
      };

      Contract.findAll().then(function (data) {
        $scope.contracts = data;
      });

      Vendor.findAll().then(function (data) {
        $scope.vendors = data;
      });

      $scope.setFiles = function ($files) {
        var file = $files ? $files[0] : null;
        $scope.files = $files;
        if (file) {
          data.file = {
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            size: file.size,
            type: file.type,
            webkitRelativePath: file.webkitRelativePath
          };
        }
      };


      $scope.create = function (form) {

        if (!form.$valid || !$scope.files) {
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
            url: '/api/document/',
            data: {
              files: $scope.files
            }
          })
          .then(function (response) {

            var document = response.data;

            $timeout(function () {
               clearInterval(intervalId);
              contract.document_id = document.id;
              Contract.create(contract)
                .then(function (data) {
                  $uibModalInstance.close(data);
                });

            });
          }, function (response) {
            if (response.status > 0) {
              $lcmAlert.error('Failed to upload file. Try again.');
              data.progress = 0;
              data.progressStyle.width = 0 + '%';
            }
          }, function (evt) {
            data.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            //data.progressStyle.width = data.progress + '%';
            if(data.progress==100){
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
