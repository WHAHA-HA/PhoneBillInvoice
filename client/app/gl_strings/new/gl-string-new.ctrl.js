/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .controller('GlStringNewCtrl', function ($scope, $uibModalInstance, GlString, GlCodeSegments, GlCodesNonVer) {
                $scope.values = [];

                GlCodeSegments.findAll().then(function (data) {
                    $scope.segments = data;
                });
                
                GlCodesNonVer.findAll().then(function (data) {
                    $scope.values = data;
                });

                var glstring = $scope.glstring = {
                    date_added: new Date(),
                    status: true
                };

                $scope.create = function (form) {
                    form.$setSubmitted();

                    if (!form.$valid) {
                        return;
                    }

                    GlString.create(glstring)
                            .then(function (result) {
                                $uibModalInstance.close(result, true);
                            });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });


}());
