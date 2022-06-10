/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .factory('GlRuleField', function (Dictionary) {

                var typeKey = 'gl-rule-field';

                function GlRuleField() {

                }
                
                GlRuleField.findAll = function () {
                    var query = {
                        where: {
                            group: {'===': typeKey}
                        },
                        orderBy: 'id'
                    };
                    return Dictionary.findAll({filter: JSON.stringify(query)});
                };

                return GlRuleField;

            });

}());
