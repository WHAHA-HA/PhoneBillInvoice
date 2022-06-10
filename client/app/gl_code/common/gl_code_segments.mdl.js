/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .factory('GlCodeSegments', function (Dictionary) {

                var typeKey = 'gl-code-segment';
                var segmentNumber = 4; //TODO: move in global config

                function GlCodeSegments() {

                }
                
                GlCodeSegments.findAll = function () {
                    var query = {
                        where: {
                            group: {'===': typeKey}
                        },
                        limit: segmentNumber,
                        orderBy: 'id'
                    };
                    return Dictionary.findAll({filter: JSON.stringify(query)});
                };

                return GlCodeSegments;

            });

}());
