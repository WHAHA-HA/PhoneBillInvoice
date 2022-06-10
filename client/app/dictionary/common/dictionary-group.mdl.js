/**
 *
 */
(function () {
    'use strict';
    angular.module('lcma')
            .factory('DictionaryGroup', function (Dictionary, $q) {
                return {
                    all: function () {
                        var defer = $q.defer();
                        Dictionary.groups().then(function (groups) {
                            defer.resolve(groups.data);
                        });
                        return defer.promise;
                    }
                };
            })
}());
