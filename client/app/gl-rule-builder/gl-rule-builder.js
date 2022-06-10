'use strict';

angular.module('lcma')
        .config(function ($stateProvider) {
            $stateProvider
                    .state('app.glrulebuilder', {
                        url: '/glrulebuilder',
                        views: {
                            "main@app": {
                                templateUrl: 'app/gl-rule-builder/list/gl-rule-builder-list.html',
                                controller: 'GlRuleBuilderListCtrl as ctx'
                            }
                        }
                    })
                    .state('app.GlRuleBuilderNew', {
                        url: '/glrulebuilder/new',
                        resolve: {
                            rule: function ($stateParams, GlRules) {
                                return null;
                            }
                        },
                        views: {
                            "main@app": {
                                templateUrl: 'app/gl-rule-builder/new/gl-rule-builder-new.html',
                                controller: 'GlRuleBuilderNew as ctx'
                            }
                        }
                    })
                    .state('app.GlRuleBuilderEdit', {
                        url: '/glrulebuilder/:id/edit',
                        resolve: {
                            rule: function ($stateParams, GlRules) {
                                return GlRules.find($stateParams.id);
                            }
                        },
                        views: {
                            "main@app": {
                                templateUrl: 'app/gl-rule-builder/new/gl-rule-builder-new.html',
                                controller: 'GlRuleBuilderNew as ctx'
                            }
                        }
                    })
        });
