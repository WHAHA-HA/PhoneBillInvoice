/**
 *
 */
(function () {
    'use strict';
    angular.module('lcma')
            .config(function ($stateProvider) {
                $stateProvider
                        .state('app.dictionary', {
                            url: '/dictionary',
                            views: {
                                "main@app": {
                                    templateUrl: 'app/dictionary/list/dictionary-list.html',
                                    controller: 'DictionaryCtrl as ctx'
                                }
                            }
                        });
            })
}());
