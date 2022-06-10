/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .factory('Dictionary', function (DS) {
                var Dictionary = DS.defineResource({
                    name: 'dictionary',
                    actions: {
                        groups: {
                            method: 'GET'
                        }
                    }
                });

                Dictionary.getDictionary = function (group) {
                    return Dictionary.find(group);
                };

                return Dictionary;
            });

}());
