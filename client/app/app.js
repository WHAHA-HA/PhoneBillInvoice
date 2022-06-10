'use strict';

angular.module('lcma', [
    'ngCookies',
    //'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'toastr',
    'ui.router',
    'ui.bootstrap',
    'ui.select',
    'ngFileUpload',
    //'ui.layout',
    //'ngScrollbar',
    //'agGrid',
    'ui.grid',
    'ui.grid.grouping',
    'ui.grid.pinning',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.treeView',
    'js-data',
    'ui.grid.exporter',
    //'treeGrid',
    'angular-loading-bar',
    'ngImgCrop',
    'nya.bootstrap.select',
    'mgo-angular-wizard',
    'colorpicker.module',
    'dndLists',
    'duScroll',
    'ngInputModified'
  ])
  // TODO: Move this to another file and support different configs by deployments system
  .constant('config', {
    APP_NAME: 'LCMA',
    API_HOST: '',
    API_PATH: '/api',
    REPORTING_BASE_URL: 'http://52.70.220.130:8080/Logi/',
    REPORTING_API_URL: '/api/report',
    REPORTING_SECURE_KEY: ''
  })
  .constant('_', window._)
  .controller('AppCtrl', function ($rootScope, $lcmaPage, $broadcast, $state, $me, $stat, Theme) {
    $rootScope.$me = $me;
    $rootScope.$layout = {

    };

    $rootScope.toggleSidebar = function () {
      angular.element('body').toggleClass('sidebar-min');
      $rootScope.$layout.minimized = !$rootScope.$layout.minimized;
    };

    if ($me.theme) {
      if (angular.element('#style-theme')) {
        angular.element('#style-theme').html($me.theme.css);
      } else {
        angular.element('head').append("<style id='style-theme'>" + $me.theme.css + "</style>");
      }
    } else {
      Theme.master().then(function (theme) {
        if (theme.data.length > 0) {
          $me.theme = theme.data[0];
          if (angular.element('#style-theme')) {
            angular.element('#style-theme').html(theme.data[0].css);
          } else {
            angular.element('head').append("<style id='style-theme'>" + theme.data[0].css + "</style>");
          }
        }
      });
    }

    $rootScope.$stat = $stat;
    $rootScope._ = window._;
  })

  .controller('MasterCtrl', function ($rootScope, $broadcast, $state, $lcmaPage, $lcmaConfirmation, $lcmaDialog, Theme) {
    $rootScope.$lcmaPage = $lcmaPage;
    Theme.master().then(function (theme) {
      if (theme.data.length > 0) {
        angular.element('head').append("<style id='style-theme'>" + theme.data[0].css + "</style>");
      }
    });


    // Catch system error 401
    $broadcast.on("system:error:401", function (e, obj) {
      $state.go('anonymous.login');
    });

    // Catch system error 403
    $broadcast.on("system:error:403", function (e, obj) {
      // Forbidden  - Display message
      $state.go('app.errorForbidden');
    });

    // Watching route state change
    $rootScope.$on('$stateChangeSuccess', function (event, toState /*, toParams, fromState, fromParams*/) {

      toState.data = toState.data || {};

      if (toState.data && toState.data.bodyClass) {
        $lcmaPage.setBodyClass(toState.data.bodyClass);
      }
      else {
        $lcmaPage.setBodyClass('');
      }
    });

        // Watching route state change
        $rootScope.$on('$stateChangeStart', function (event, toState , toParams, fromState, fromParams) {

            $lcmaPage.setTitle('');

            var formId = $lcmaConfirmation.getFormId();
            var formName = $lcmaConfirmation.getFormName();
            var form = document.getElementById(formId);

            var formScope = angular.element(form).scope();

            if (!formScope) {
                return;
            }

            if (formScope[formName].$dirty) {
                event.preventDefault();

                $lcmaDialog.confirm({
                    titleText: 'Please confirm',
                    bodyText: 'You have unsaved changes. Are you sure you want to leave this page?'
                })
                    .result.then(function(res) {

                        //mark the form as not dirty, otherwise this dialog box shows infinitely
                        formScope[formName].$setPristine();
                        $state.go(toState, toParams);

                    }, function(error) {
                        $lcmaConfirmation.markDirtyFields();
                    });


            }
        });

        window.onbeforeunload = function (event) {

            var formId = $lcmaConfirmation.getFormId();
            var formName = $lcmaConfirmation.getFormName();
            var form = document.getElementById(formId);

            var formScope = angular.element(form).scope();

            if (!formScope) {
                return;
            }

            if (formScope[formName].$dirty) {

                $lcmaConfirmation.markDirtyFields();
                return "Needs confirmation Dialogbox";
            }

        };
  })

  .config(function (config, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $lcmaGridProvider, $lcmaPagerProvider, DSProvider, DSHttpAdapterProvider) {
    // URL route provider configuration
    $urlRouterProvider
      .when('/', '/dash')
      .otherwise('/pageNotFound');

    $lcmaGridProvider.extendDefaults({
      enableSelectAll: true
    });

    $lcmaPagerProvider.extendDefaults({
      size: 20
    });

    // Register API interceptor
    $httpProvider.interceptors.push('apiInterceptor');

    // Top state all other will inherit
    $stateProvider
      .state('app', {
        url: '',
        abstract: true,
        views: {
          'master@': {
            controller: 'AppCtrl',
            templateUrl: 'app/app.main.html'
          }
        },
        resolve: {
          $me: function (UserService) {
            return UserService.me().then(function (response) {
              var meObj = response.data;

              // TODO: WHat is this ? This is not place for this.
              meObj['charge_grids_col_defs'] = meObj.charge_grids_col_defs ? (JSON.parse(meObj.charge_grids_col_defs)) : null;
              meObj['charge_selection_grids_col_defs'] = meObj.charge_selection_grids_col_defs ? (JSON.parse(meObj.charge_selection_grids_col_defs)) : null;
              return meObj;
            });
          },
          $permissions: function ($me, $rootScope, Permission) {
            return Permission.me().then(function (p) {
              $rootScope.$permissions = p.data;
            });
          },
          $modules: function (AppModule) {
            return AppModule.findAll();
          },
          $roles: function (Role) {
            return Role.findAll();
          },
          $rootSettings: function ($http) {
            return $http.get('config/setting.json')
              .then(function (response) {
                return response.data;
              })
          },
          $stat: function (Stat) {
            return Stat.findAll().then(function (response) {
              return response;
            });
          }
        }
      })
      .state('anonymous', {
        abstract: true,
        views: {
          'master@': {
            templateUrl: 'app/app.anonymous.html'
          }
        },
        data: {
          bodyClass: 'login-body'
        }

      });

    $locationProvider.html5Mode(true);

    angular.extend(DSProvider.defaults, {
      idAttribute: 'id',
      afterInject: function (resource, data) {

        if (angular.isArray(data) && data.length && data[0].$total) {
          var meta = data.shift();
          data.$total = meta.$total;
        }
        return data;
      }
    });

    angular.extend(DSHttpAdapterProvider.defaults, {
      basePath: config.API_PATH,

      deserialize: function deserialize(resourceConfig, response) {
        var resp = response ? ('data' in response ? response.data : response) : response;

        if (resp.items) {
          if (resp.items.length) {
            resp.items.unshift({id: -999, $total: resp.total});
          }
          return resp.items;
        }

        return resp;
      }
    });
  });
