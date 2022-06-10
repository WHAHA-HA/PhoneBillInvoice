/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .controller('GlStringEditCtrl', function ($scope, $uibModalInstance, GlString, glstring, GlCodeSegments) {

                GlCodeSegments.findAll().then(function (data) {
                    $scope.segments = data;                   
                });

                $scope.glstring = angular.copy(glstring);

                $scope.save = function (form) {
                    form.$setSubmitted();

                    if (!form.$valid) {
                        return;
                    }

                    GlString.status({data: {object: $scope.glstring}})
                            .then(function (result) {
                                $uibModalInstance.close(result.data);
                            });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });


}());
