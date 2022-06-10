/**
 *
 */
(function () {
    'use strict';

    function DictionaryNewCtrl ($scope, $uibModalInstance, Dictionary, DictionaryGroup) {
        
                var dictionary = $scope.dictionary = {};
                $scope.items = [];
                DictionaryGroup.all().then(function (items) {
                    $scope.items = items.sort(function(a,b){
                        return a.localeCompare(b);
                    });
                });

                $scope.create = function (form) {
                    
                    form.$setSubmitted();

                    if (!form.$valid) {
                        return;
                    }

                    Dictionary.create({
                        value: dictionary.value,
                        key: dictionary.key,
                        custom_key: dictionary.custom_key,
                        group: dictionary.group,
                        abbreviation: dictionary.abbreviation,
                        color: dictionary.color
                    }).then(function (dictionary) {
                        $uibModalInstance.close(dictionary, true);
                    });


                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
     angular.module('lcma')
            .controller('DictionaryNewCtrl', DictionaryNewCtrl);


}());
