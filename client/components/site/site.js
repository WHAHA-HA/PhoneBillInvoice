/**
 *
 */
(function () {
  'use strict';
  /**
   * display site detail vertically
   * @param site
   * @constructor
   */

  function SiteInfoDirective() {

    return {
      restrict: 'EA',
      scope: {
        siteId: '=?',
        site: '=?',
        editing: '=',
        preview: '=',
        equipmentId: '=?',
        equipmentInterfaceId: '=?'
      },
      templateUrl: 'components/site/site-detail.html',
      controller: function ($scope, $uibModal, $lcmAlert, Site) {

        $scope.site = null;

        $scope.selection = {value: null};
        $scope.selectedEquipment = {value: null};
        $scope.selectedEquipmentInterface = {value: null};

        //
        Site.findAll().then(function (sites) {
          $scope.sites = sites;

          if ($scope.siteId) {
            $scope.site = _.find($scope.sites, {id: $scope.siteId});
            $scope.selection.value = $scope.site;

            /**
             * updated selected equipment
             */
            $scope.selectedEquipment.value = _.find($scope.site.equipments,{id: $scope.equipmentId});

              if ($scope.selectedEquipment.value) {
                  $scope.selectedEquipmentInterface.value = _.find($scope.selectedEquipment.value.equipment_interfaces,{id: $scope.equipmentInterfaceId});
              }
              else {
                  $scope.selectedEquipmentInterface.value = null;
              }


          }

          // watch the model:
          $scope.$watch('selection.value', function(newValue, oldValue) {
            if (newValue === oldValue) {
              return;
            }

            if (newValue) {
              $scope.site = newValue;
              $scope.siteId = newValue.id;
            }
            else {
              $scope.site = null;
              $scope.siteId = null;
            }

            $scope.equipmentId = null;
            $scope.selectedEquipment.value = null;

          });

            //update equipmentId: watch should be initialized after Site is fully loaded
            $scope.$watch('selectedEquipment.value', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    $scope.equipmentId = newValue.id;
                }
                else {
                    $scope.equipmentId = null;

                }
                $scope.equipmentInterfaceId = null;
                $scope.selectedEquipmentInterface.value = null;

            });

            //update equipmentId
            $scope.$watch('selectedEquipmentInterface.value', function(newValue, oldValue) {

                if (newValue === oldValue) {
                    return;
                }

                if (newValue) {
                    $scope.equipmentInterfaceId = newValue.id;
                }
                else {
                    $scope.equipmentInterfaceId = null;

                }

            });


        });



        // Handles site list change event
        $scope.onSelect = function (site) {

          $scope.site = site;
          $scope.siteId = site.id;
          //$scope.selection = site;

        };

        //show bootstrap dialog search modal
        $scope.searchSite = function () {

          var dlg = $uibModal.open({
            templateUrl: 'components/site/site-search.html',
            //windowClass: 'site-search-modal',
            controller: "SiteSearchCtrl",
            backdrop: 'static',
            controllerAs: 'ctx'

          });

          /**
           * Initialize Variables
           */

          dlg.result.then(function (site) {

            $scope.site = site;
            $scope.siteId = $scope.site.id;
            $scope.selection.value = $scope.site;

          }, function (reason) {
            console.log('dismissed');
          });
        };

        /**
         * Opens add site dialog
         */
        $scope.addSite = function () {

          $uibModal.open({
            templateUrl: 'app/sites/new/site-new.html',
            controller: 'SiteNewCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window'
          }).result.then(function (site) {
            $scope.sites.push(site);
            $lcmAlert.success('New site has been created.');
          });

        };


      }
    };

  }

  function SitePickerDirective(Site, $uibModal) {

    return {
      restrict: 'EA',
      replace: true,
      scope: {
        siteId: '='
      },
      require: ['ngDisabled', 'ngModel'],
      templateUrl: 'components/site/site-picker.html',
      /*template: function (elem, attrs) {
       return '<div class="input-group"><select name="' + attrs.name + '" ng-model=selection.value  class="form-control" ng-options="site as site.site_id for site in sites" ng-change="onSelect()"></select><span class="input-group-addon" ng-click="addSite()"><i class="fa fa-plus"></i></span><span class="input-group-addon" ng-click="searchSite()"><i class="fa fa-search"></i></span></div>'
       },*/
      controller: function ($scope, $attrs, $element) {

        $scope.selection = null;

        //$scope.site = {id: $scope.siteId};
        $scope.selection = $scope.siteId;

        Site.findAll().then(function (sites) {
          $scope.sites = sites;

          //if ($scope.siteId) {
          //  $scope.site = {id: $scope.siteId};
          //  $scope.selection = $scope.siteId;
          //
          //}

        });

        $scope.addItem = function () {

          $uibModal.open({
            templateUrl: 'app/sites/new/site-new.html',
            controller: 'SiteNewCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window'
          }).result.then(function (site) {
            $scope.sites.push(site);
          });

        };

        $scope.$watch('selection', function (x) {
          $scope.siteId = x;
        });

        $scope.$watch('siteId', function(x){
          $scope.selection = $scope.siteId;
        });

        //show bootstrap dialog search modal
        $scope.searchItem = function () {

          $uibModal.open({
            templateUrl: 'components/site/site-search.html',
            controller: "SiteSearchCtrl",
            backdrop: 'static',
            controllerAs: 'ctx'

          }).result.then(function (site) {

            $scope.siteId = site.id;
            $scope.selection  = $scope.siteId;

          }, function (reason) {

          });
        };

      }
    };

  }

  function SiteSearchCtrl($scope, $uibModalInstance, $lcmaGrid, $lcmaGridFilter, $lcmAlert, $uibModal, $lcmaPager, $lcmaPage, $lcmaDialog, Site) {

    var _this = this;

    // Close Modal
    _this.close = function () {
      $uibModalInstance.dismiss('cancel');
    };

    _this.ok = function () {

      var selSites = _this.gridApi.selection.getSelectedRows();

      if (selSites && selSites.length > 0) {
        $uibModalInstance.close(selSites[0]);
      }
      else {
        $uibModalInstance.dismiss('cancel');
      }

    };


    var grid = _this.gridOptions = $lcmaGrid({


      onRegisterApi: function (api) {

        _this.gridApi = api;

        api.core.on.sortChanged($scope, function (grid, columns) {
          _this.siteQuery.orderBy = columns.map(function (x) {
            return [x.field, x.sort.direction.toUpperCase()];
          });

          _this.refresh();
        });

        api.core.on.filterChanged($scope, function (x) {

          $lcmaGridFilter(this.grid, _this.siteQuery)
            .applyAll(grid.columnDefs.filter(function (x) {
              return x.enableFiltering;
            }));

          _this.refresh();
        });
      },
      multiSelect: false

    })
      .addColumn('id', 'Site #')
      .addColumn('site_id', 'Site ID', {
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.site_id}}</div>'
      })
      .addColumn('site.name', 'Site')
      .addColumn('building.name', 'Building')
      .addColumn('site_type', 'Site Type')
      .addColumn('address1', 'Address1')
      .addColumn('address2', 'Address2')
      .addColumn('address3', 'Address3')
      .addColumn('city_state_zip', 'City/State/Zip', {
        enableFiltering: true,
        width: 180,
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.city}}, {{row.entity.state}}, {{row.entity.zip}}</div>'
      })
      .options();


    /**
     * Holds pager instance.
     */
    _this.pager = $lcmaPager({
      onGo: function () {
        _this.siteQuery.limit = _this.pager.size;
        _this.siteQuery.offset = _this.pager.from() - 1;
        _this.refresh();
      }
    });


    /**
     * Holds sites query.
     */
    _this.siteQuery = {
      where: {},
      limit: _this.pager.size,
      offset: this.pager.from() - 1
    };


    _this.refresh = function () {

      _this.siteQuery.where['id'] = {'>': -(new Date().getMilliseconds())};
      Site.findAll({filter: JSON.stringify(_this.siteQuery)})
        .then(function (data) {
          grid.data = data;
          _this.pager.total = data.$total;
        });

    };

    _this.refresh();

  }


  angular.module('lcma')
    .directive('lcmaSiteDetail', SiteInfoDirective)
    .directive('lcmaSitePicker', SitePickerDirective)
    .controller('SiteSearchCtrl', SiteSearchCtrl)
  ;


}());
