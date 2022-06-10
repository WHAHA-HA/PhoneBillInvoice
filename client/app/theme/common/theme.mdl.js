(function () {
    'use strict';

    angular.module('lcma')
            .factory('Theme', function (DS) {

                return DS.defineResource({
                    name: 'theme',
                    actions: {
                        master: {
                            method: 'GET'
                        }
                    }
                });
            });

}());
