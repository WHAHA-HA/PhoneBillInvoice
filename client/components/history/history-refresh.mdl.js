/**
 *
 */
(function () {
    'use strict';

    angular.module('lcma')
            .factory('HistoryRefresh', function ($broadcast) {
                return {
                    refresh: function () {
                        $broadcast.emit('refresh-history');
                    }
                };

            });

}());