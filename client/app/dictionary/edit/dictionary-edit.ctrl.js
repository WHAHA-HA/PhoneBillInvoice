/**
 *
 */
(function () {
    'use strict';

    function DictionaryEditCtrl($scope, $uibModalInstance, dictionary, Dictionary) {
        
                $scope.dictionary = angular.copy(dictionary);
                
                
                $scope.update = function (form) {

                    if (!form.$valid) {
                        return;
                    }

                    Dictionary.update(dictionary.id, $scope.dictionary).then(function (dictionary) {
                        $uibModalInstance.close(dictionary);
                    });


                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }
      
     angular.module('lcma')
            .controller('DictionaryEditCtrl', DictionaryEditCtrl);


}());
