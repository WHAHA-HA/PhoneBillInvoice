/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .controller('DictionaryGroupCtrl', function ($scope, $uibModalInstance, group, Dictionary) {

                $scope.group = angular.copy(group);
                    $scope.items = [];
                
                Dictionary.getDictionary($scope.group).then(function (items) {
                    $scope.items = items;                    
                });
                
                $scope.sortAlphabeticallyAsc = function(){
                     $scope.items.sort(function(a, b){
                         return a.value.localeCompare(b.value);
                     });
                }
                
                $scope.sortAlphabeticallyDesc = function(){
                     $scope.items.sort(function(a, b){
                         return b.value.localeCompare(a.value);
                     });
                }

                $scope.save = function (form) {

                    form.$setSubmitted();

                    if (!form.$valid) {
                        return;
                    }
                    for(var i in $scope.items){
                        $scope.items[i].order_number = Number(i)+1;
                        Dictionary.update($scope.items[i].id, $scope.items[i]);
                    }
                    $uibModalInstance.close();

                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });


}());
