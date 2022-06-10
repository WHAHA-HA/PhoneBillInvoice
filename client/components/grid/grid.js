/**
 */
(function () {
  'use strict';


  function DateFilter($filter) {
    return function (input) {

      return $filter('date')(input, 'MM/dd/yyyy', '+0000')

    }
  }


  function DateTimeFilter($filter) {
    return function (input) {

      return $filter('date')(input, 'MM/dd/yyyy HH:mm')

    }
  }


  function NoDataMessage($compile, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var data = attrs.uiGrid + ".data.length";
        var template = '<div ng-show="!' + data + '" class="grid-no-data" >No data available</div>';
        var tmpl = angular.element(template);
        $compile(tmpl)(scope);
        var delay = attrs.lcmaNoDataMessage;
        $timeout(function () {
          element.find('.ui-grid-viewport:last-child').append(tmpl);
        }, delay ? delay : 0);
      }
    };
  }

  angular.module('lcma')
    .directive('lcmaNoDataMessage', NoDataMessage)
    .filter('lcmaDate', DateFilter)
    .filter('lcmaDateTime', DateTimeFilter)
    .provider('$lcmaGrid', function (uiGridConstants) {

      var gridOptionsDefaults = {
        enableCellEditOnFocus: true,
        enableColumnMenus: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableSelectAll: true,
        selectionRowHeaderWidth: 25,
        rowHeight: 25,
        enableCellEdit: false,
        //showGridFooter: true,
        showColumnFooter: false,
        enableSorting: true,
        useExternalSorting: true,
        multiSelect: true,
        enableFiltering: true,
        useExternalFiltering: true,
        enableColumnResizing: true,
        enableHorizontalScrollbar: true        
      };

      var dateColumnDefaults = {
        cellFilter: 'lcmaDate',
        cellClass: 'cell-date',
        width: 120,
        type: 'date',
        enableFiltering: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
        '<lcma-date-filter ng-model="colFilter.term"></lcma-date-filter>' +
        '</div>'
      };

      var dateTimeColumnDefaults = {
        cellFilter: 'lcmaDateTime',
        cellClass: 'cell-datetime',
        width: 140,
        enableFiltering: true,
        type: 'date',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
        '<lcma-date-filter ng-model="colFilter.term"></lcma-date-filter>' +
        '</div>'
      };

      var currencyColumnDefaults = {
        cellClass: 'cell-currency',
        cellFilter: 'currency',
        footerCellClass: 'cell-currency',
        footerCellFilter: 'currency',
        width: 120,
        type: 'number',
        enableFiltering: true,
        aggregationType: uiGridConstants.aggregationTypes.sum,
        aggregationHideLabel: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
        '<div ng-model="colFilter.term" lcma-number-filter></div>'
      };

      var booleanColumnDefaults = {
        cellClass: 'cell-boolean',
        width: 30,
        cellFilter: 'boolean',
        type: 'boolean',
        enableFiltering: true,
        aggregationType: uiGridConstants.aggregationTypes.sum,
        aggregationHideLabel: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
        '<lcma-list-filter filter-options="colFilter.selectOptions" ng-model="colFilter.term" nulls="colFilter.nulls"></lcma-list-filter>' +
        '</div>',
        filter: {
          selectOptions: [
            {value: true, label: 'Yes'},
            {value: false, label: 'No'}
          ]
        }
      };

      var numberColumnDefaults = {
        cellClass: 'cell-number',
        cellFilter: 'number',
        width: 100,
        type: 'number',
        enableFiltering: true,
        //aggregationType: uiGridConstants.aggregationTypes.sum,
        aggregationHideLabel: true,
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
        '<div ng-model="colFilter.term" lcma-number-filter></div>'
      };

      var statusColumnDefaults = {
        cellClass: 'cell-status',
        cellFilter: 'currency',
        enableFiltering: true,
        footerCellClass: 'f-cell-currency',
        footerCellFilter: 'currency',
        width: 90,
        type: 'status',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
        '<lcma-list-filter filter-options="colFilter.selectOptions" ng-model="colFilter.term" nulls="colFilter.nulls"></lcma-list-filter>' +
        '</div>'
      };

      var relColumnDefaults = {
        cellClass: 'cell-text',
        footerCellClass: 'f-cell-text',
        //footerCellFilter: 'text',
        type: 'status',
        filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters">' +
        '<lcma-list-filter filter-options="colFilter.selectOptions" column="col.field" value="colFilter.value" nulls="colFilter.nulls" map="colFilter.map" ng-model="colFilter.term" warning="colFilter.warning"></lcma-list-filter>' +
        '</div>'
      };

      var commandColumnDefaults = {
        headerCellClass: 'cell-header-command',
        width: 24,
        cellClass: 'cell-text cell-command text-center',
        enableFiltering: false,
        enableSorting: false
      };

      var columnDefaults = {
        width: 120,
        enableFiltering: true,
        sortDirectionCycle: [uiGridConstants.ASC, uiGridConstants.DESC]
      };


      this.extendDefaults = function (config) {
        if (config) {
          angular.extend(gridOptionsDefaults, config);
        }
      };

      this.extendDateColumnDefaults = function (config) {
        if (config) {
          angular.extend(dateColumnDefaults, config);
        }
      };

      this.extendDateTimeColumnDefaults = function (config) {
        if (config) {
          angular.extend(dateTimeColumnDefaults, config);
        }
      };

      this.extendCurrencyColumnDefaults = function (config) {
        if (config) {
          angular.extend(currencyColumnDefaults, config);
        }
      };

      this.extendStatusColumnDefaults = function (config) {
        if (config) {
          angular.extend(statusColumnDefaults, config);
        }
      };

      this.extendCommandColumnDefaults = function (config) {
        if (config) {
          angular.extend(commandColumnDefaults, config);
        }
      };


      this.$get = function (UserSettingsService) {

        return function (config) {

          var grid = {},
            gridOptions = {
              columnDefs: []
            };

          gridOptions.instance = grid;
          
        if (config.onRegisterApi) {
            var t = config.onRegisterApi;
            delete config.onRegisterApi;
            gridOptionsDefaults.onRegisterApi = function (api) {                
                t(api);
                if(config.settingKey){
                    grid.loadAndApplySettings(config.settingKey, api);
                }
            };
        }
          
          angular.extend(gridOptions, gridOptionsDefaults, config);

          /**
           * Returns grid options object.
           * @returns {{columnDefs: Array}}
           */
          grid.options = function () {
            return gridOptions;
          };

          /**
           * Adds new column to the column definitions list.
           * @param field
           * @param name
           * @param config
           * @returns {{}}
           */
          grid.addColumn = function (field, name, config) {
            config = config || {};

            // TODO: we need special handling for cellClass as user can add class and we must no overwrite but extend

            var col = angular.extend({}, columnDefaults, config, {
              field: field,
              name: name,
              displayName: name,
              headerName: name
            });
            gridOptions.columnDefs.push(col);

            return grid;
          };

          /**
           * Adds new date column to the column definitions list.
           * @param name
           * @param field
           * @param config
           * @returns {{}}
           */
          grid.addDateColumn = function (name, field, config) {
            config = config || {};

            var col = angular.extend({type: 'date'}, dateColumnDefaults, config);

            grid.addColumn(name, field, col);

            return grid;
          };

          /**
           * Adds new date-time column to the column definitions list.
           * @param name
           * @param field
           * @param config
           * @returns {{}}
           */
          grid.addDateTimeColumn = function (name, field, config) {
            config = config || {};

            var col = angular.extend({type: 'datetime'}, dateTimeColumnDefaults, config);

            grid.addColumn(name, field, col);

            return grid;
          };

          /**
           * Adds new currency column to the column definitions list.
           * @param name
           * @param field
           * @param config
           * @returns {{}}
           */
          grid.addCurrencyColumn = function (name, field, config) {
            config = config || {};

            var col = angular.extend({type: 'currency'}, currencyColumnDefaults, config);

            grid.addColumn(name, field, col);

            return grid;
          };

          /**
           * Adds new currency column to the column definitions list.
           * @param name
           * @param field
           * @param config
           * @returns {{}}
           */
          grid.addBooleanColumn = function (name, field, config) {
            config = config || {};

            var col = angular.extend({type: 'boolean'}, booleanColumnDefaults, config);

            grid.addColumn(name, field, col);

            return grid;
          };

          /**
           * Adds new number column to the column definitions list.
           * @param name
           * @param field
           * @param config
           * @returns {{}}
           */
          grid.addNumberColumn = function (name, field, config) {
            config = config || {};

            var col = angular.extend({type: 'number'}, numberColumnDefaults, config);

            grid.addColumn(name, field, col);

            return grid;
          };

          /**
           * Adds new status column to the column definitions list.
           * @param name
           * @param field
           * @param config
           * @returns {{}}
           */
          grid.addStatusColumn = function (name, field, config) {
            config = config || {};

            var col = angular.extend({type: 'status'}, statusColumnDefaults, config);

            grid.addColumn(name, field, col);

            return grid;
          };

          /**
           * Adds new relation column to the column definitions list.
           * @param name
           * @param field
           * @param config
           * @returns {{}}
           */
          grid.addRelColumn = function (name, field, config) {
            config = config || {};

            var col = angular.extend({type: 'rel'}, relColumnDefaults, config);

            grid.addColumn(name, field, col);

            return grid;
          };

          /**
           * Adds new command column to the column definitions list.
           * @param name
           * @param field
           * @param config
           * @returns {{}}
           */
          grid.addCommandColumn = function (name, field, config) {
            config = config || {};

            var col = angular.extend({type: 'command'}, commandColumnDefaults, config);

            grid.addColumn(name, field, col);

            return grid;
          };

          /**
           * Load settings and apply it to grid.
           * @param key
           * @param api
           */
          grid.loadAndApplySettings = function (key, api) {
            UserSettingsService.load(key)
              .then(function (settings) {
                grid.updateFromSettings(settings, api);
              });
          };
          
          /**
           * Updates grid setup from external settings provided
           * @param settings
           * @param api
           */
          grid.updateFromSettings = function (settings, api) {

            if(settings.is_current) {

              var visibleColumns = settings.value.columnDefs;

              gridOptions.columnDefs.forEach(function (x) {

                if (x.type === 'command') {
                  return;
                }


                x.visible = visibleColumns.filter(function (c) {
                    return c.field === x.field;
                  }).length > 0;
              });


              api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            }


          };

          return grid;


        };
      };

    })

}());
