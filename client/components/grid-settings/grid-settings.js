/**
 *
 */
(function () {
  'use strict';


  function GridSettingsLinkDirective($lcmaDialog) {

    return {
      controllerAs: 'ctx',
      replace: true,
      scope: {
        name: '@name',
        onApply: '='
      },
      template: '<button class="btn btn-default" ng-click="ctx.openSettings()"><i class="fa fa-cog"></i></button>',
      controller: function ($scope) {

        var vm = this;
        vm.openSettings = openSettings;

        function openSettings() {
          $lcmaDialog.open({
            controller: 'GridColumnCtrl',
            controllerAs: 'ctx',
            templateUrl: 'components/grid-settings/grid-settings.html',
            size: 'lg',
            resolve: {
              $currentGrid: function () {
                return {
                  name: $scope.name
                }
              }
            }
          }).result.then(function (response) {

            if ($scope.onApply) {
                $scope.onApply(response);
            }

          });
        }        

      }
    }

  }

  function GridSettingsHrefDirective($lcmaDialog) {

    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {

        elem.bind('click', function () {

          openSettings(attrs.lcmaGridSettingsHref);

          scope.$apply();

        });

        function openSettings(name) {
          $lcmaDialog.open({
            controller: 'GridColumnCtrl',
            controllerAs: 'ctx',
            templateUrl: 'components/grid-settings/grid-settings.html',
            size: 'lg',
            resolve: {
              $currentGrid: function () {
                return {
                  name: name
                }
              }
            }
          }).result.then(function (response) {

            if (attrs.onApply) {
              var fn = scope.$eval(attrs.onApply);
              fn(response);
            }

          });
        }

      }
    }

  }

  function GridColumnCtrl($scope, UserSettingsService, $uibModalInstance, $currentGrid, $lcmaDialog, $lcmAlert) {

    var _this = this;

    function updateColumnsView(settings) {

      settings.gridCols = settings.gridCols || {};

      var columnDefs = settings.value.columnDefs;
      // drag and drop available lists
      settings.gridCols.A = angular.copy(_this.allColumns);
      settings.gridCols.A.$all = true;
      settings.gridCols.B = [];

      var selectedCols = columnDefs.filter(function (z) {
        return z.visible !== false;
      });


      // run add columns according to col type
      _.each(selectedCols, function (colObj) {

        var col = _.find(columnDefs, {field: colObj.field});

        if (!col) {
          return;
        }

        /**
         * Add selected field
         */
        _.remove(settings.gridCols.A, {field: colObj.field});
        settings.gridCols.B.push(col);
      });
    }

    /**
     * Queries Setting.json and DB Setting Table
     */
    _this.query = function () {

      var key = $currentGrid.name;

      UserSettingsService.loadDefault(key)
        .then(function (settings) {
          _this.defaultSettings = settings;
          _this.allColumns = settings.value.columnDefs;

          return UserSettingsService.loadAll(key);
        })
        .then(function (settingsList) {

          _this.settings = settingsList;

          if (_this.settings.filter(function (x) {
              return x.is_default;
            }).length) {

            _this.defaultSettings = _this.settings[0];

          }
          else {
            _this.settings.splice(0, 0, _this.defaultSettings);
          }


          // select current
          var current = _this.settings.filter(function (x) {
            return x.is_current;
          });

          _this.selectedSettings = current.length ? current[0] : _this.settings[0];

          _this.gridListNames = {
            A: 'Available Fields',
            B: 'Selected Fields'
          };

          updateColumnsView(_this.selectedSettings);
        });

    };
    
    _this.remove = function(item){
      $lcmaDialog.remove({
                message: ' Setting ' + item.name
      }).result.then(function () {
          UserSettingsService.destroy(item.id).then(function(){
               $lcmAlert.success('Setting has been deleted.');
          });
      });
    };
    
    _this.new = function () {
      var copy = UserSettingsService.copy(_this.selectedSettings);

      UserSettingsService.save(copy).then(function (entry) {
        _this.settings.push(entry);
        _this.selectedSettings = entry;
        updateColumnsView(entry);
      });

    };

    _this.setAsCurrent = function () {

      _this.settings.forEach(function (x) {
        x.is_current = false;
      });

      UserSettingsService.saveAll(_this.settings)
        .then(function () {
          _this.selectedSettings.is_current = true;
          return UserSettingsService.save(_this.selectedSettings);
        })
        .then(function (data) {
          $uibModalInstance.close(data);
        });
    };


    /**
     * Copy all of A to B
     */
    _this.addAllAvailableFields = function () {
      _this.selectedSettings.gridCols.B = _.concat(_this.selectedSettings.gridCols.B, _this.selectedSettings.gridCols.A)
      _this.selectedSettings.gridCols.A = [];
    };

    /**
     * Remove all Columns
     */
    _this.delAllSelectedFields = function () {
      _this.selectedSettings.gridCols.A = _.concat(_this.selectedSettings.gridCols.A, _this.selectedSettings.gridCols.B);
      _this.selectedSettings.gridCols.B = [];
    };

    /**
     * Remove One Column
     */
    _this.delSelectedField = function () {

      var sels = _.remove(_this.selectedSettings.gridCols.B, {selected: true});
      _this.selectedSettings.gridCols.A = _.concat(_this.selectedSettings.gridCols.A, sels);

      _.each(sels, function (colObj) {
        colObj.selected = false;
      });
    };

    _this.onListMoved = function (list, index) {
      list.splice(index, 1);

      angular.extend(_this.selectedSettings.value, {
        columnDefs: _this.selectedSettings.gridCols.B
      });
    };

    _this.visibleFields = function () {
      return _this.selectedSettings ? _this.selectedSettings.gridCols.B : [];
    };

    /**
     * Return selected fields
     */
    _this.update = $scope.update = function () {

      var obj = angular.copy(_this.selectedSettings);
      obj.value = obj.value || {};
      obj.key = $currentGrid.name;
      angular.extend(obj.value, {
        columnDefs: obj.gridCols.B
      });

      UserSettingsService.save(obj)
        .then(function (data) {
          $uibModalInstance.close(data);
        });
    };

    _this.selectSettings = function (sett) {
      _this.selectedSettings = sett;

      updateColumnsView(_this.selectedSettings);

      //_this.selectedCols = $lcmaSetting.getCols(_this.colSetting, _this.availableGridSettings.chargesGrid.cols);
      //_this.query();
    };

    /**
     * Cancels all changes and closes the window
     */
    _this.cancel = $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    this.query();

  }

  angular.module('lcma')
    .directive('lcmaGridSettingsLink', GridSettingsLinkDirective)
    .directive('lcmaGridSettingsHref', GridSettingsHrefDirective)
    .controller('GridColumnCtrl', GridColumnCtrl)
  ;

}());
