
(function () {
    'use strict';

    angular.module('lcma')
            .factory('GlCodesNonVer', function (DS) {

                var GlCodesNonVer = DS.defineResource({
                    name: 'gl_codes',
                    actions: {
                        deleteAll: {
                            method: 'POST'
                        },
                        invoiceSummary:{
                            method: 'GET'
                        }
                    }
                });

                return GlCodesNonVer;
            });
}());
