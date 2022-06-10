/**
 *
 */
(function () {
  'use strict';

  function AccountPickerDirective(Account, $uibModal) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        model: '=ngModel',
        vendorIds: '=vendorIds',
        multiple: '@multiple'
      },
      templateUrl: 'components/account/account.html',
      controller: function ($scope, $timeout) {


          $scope.selection = null;
          $scope.selection = $scope.model;



        function select(){
          $scope.accounts.forEach(function (item) {
            if(item.id === $scope.model) {
              $scope.selection = item;
            }
          })
        }

        $scope.loadAccounts = function (initial) {
          if (!$scope.vendorIds || ($scope.vendorIds.length === 1 && !$scope.vendorIds[0])) {

            Account.findAll({filter: JSON.stringify({orderBy: [['account_no', 'ASC']]})}).then(function (accounts) {
                $scope.accounts = accounts;
                //when account list changes, first item is selected by default, to prevent this use timeout
                if (initial === false) {
                    $timeout(function() {
                        $scope.selection = [];
                    });
                }
            });
          }
          else {
            //{"where":{"vendor_ids":[3,1]},"limit":50,"offset":0}
            var query = {
                where: {
                    vendor_id: {in: $scope.vendorIds}
                },
                orderBy: [['account_no', 'ASC']]

            };

            Account.findAll({filter: JSON.stringify(query)}).then(function (accounts) {
                $scope.accounts = accounts;
                //when account list changes, first item is selected by default, to prevent this use timeout
                if (initial === false) {
                    $timeout(function() {
                        $scope.selection = [];
                    });
                }

            });
          }
        };


        $scope.$watch('selection', function(x){
          $scope.model = x;
        });

        $scope.$watch('vendorIds', function(newValue, oldValue){

            if (!newValue || !oldValue) {
                return;
            }

            if (newValue.length !== oldValue.length || newValue[0] !== oldValue[0]) {
                $scope.selection = [];
                $scope.loadAccounts(false); // do not need to clear the selection
            }


        });

        $scope.$watch('model', function(x){
          $scope.selection = $scope.model;
        });

        /**
         * check all
         */
        $scope.checkAll = function() {
          $scope.selection = _.map($scope.accounts, 'account_no');
        };

        /**
         * clear all
         */
        $scope.clearAll = function() {
            if ($scope.multiple) {
                $scope.selection = [];
            }
            else {
                $scope.selection = null;
            }

        };

         $scope.clearItem = function() {

             if ($scope.multiple) {
                 $scope.selection = [];
             }
             else {
                 $scope.selection = null;
             }
        };



        /**
         * Opens add vendors dialog
         */
        $scope.addItem = function () {
          $uibModal.open({
            templateUrl: 'app/accounts/new/account-new.html',
            controller: 'AccountNewCtrl',
            backdrop: 'static'
          }).result.then(function (account) {
            $scope.accounts.push(account);
          });
        };



        $scope.loadAccounts(true);

      }
    };

  }

  angular.module('lcma')
    .directive('lcmaAccountPicker', AccountPickerDirective);


}());
