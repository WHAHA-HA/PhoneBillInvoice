'use strict';

angular.module('lcma')
        .controller('ThemeCtrl', function ($scope, $uibModalInstance, $uibModal, Theme, ThemeSchema, User) {


            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.applyTheme = function (theme) {
                angular.element('#style-theme').html(theme.css);
                $scope.selected = theme.id;
                User.applyTheme($scope.$me.id, {data: theme}).then(function () {
                    $scope.$me.theme_id = theme.id;
                    $scope.$me.theme = theme;                    
                });
            };

            $scope.save = function (opt) {
                var obj = angular.copy($scope.theme);
                obj.editable = true;
                var t = {};
                var css = "";
                for (var i = 0; i < $scope.theme.code.length; i++) {
                    t[$scope.theme.code[i].id] = {"color": $scope.theme.code[i].color};
                    css += $scope.theme.code[i].class + "{" + $scope.theme.code[i].property + ":" + $scope.theme.code[i].color + " !important}";
                }
                obj.code = t;
                obj.css = css;
                if ($scope.theme.id && opt) {
                    Theme.update($scope.theme.id, obj).then(function (theme) {
                        $scope.applyTheme(theme, function () {
                            Theme.findAll().then(function (themes) {
                                $scope.themes = themes;
                            });
                        });
                    });
                } else {
                    //save as
                    delete obj.id;
                    Theme.create(obj).then(function (theme) {
                        $scope.themes.push(theme);
                        $scope.applyTheme(theme);
                    });
                }
            };


            Theme.findAll().then(function (themes) {
                $scope.themes = themes;
            });

            $scope.loadTheme = function (theme) {
                var items = angular.copy(ThemeSchema.data);
                for (var i = 0; i < items.length && theme; i++) {
                    if (theme.code && theme.code[items[i].id]) {
                        items[i].color = theme.code[items[i].id].color;
                    }
                }
                $scope.theme = angular.copy(theme) || {};
                $scope.theme.code = items;
            };

            $scope.loadTheme($scope.$me.theme);


            $scope.selected = $scope.$me.theme.id;

            $scope.select = function (index) {
                $scope.selected = index;
            };
        });
