
(function () {
    'use strict';

    angular.module('lcma')
            .factory('GlString', function (DS) {

                var GlString = DS.defineResource({
                    name: 'gl_string',
                    actions: {
                        status: {
                            method: 'PUT'
                        }
                    }
                });

                return GlString;
            });
}());
