/**
 *
 */
(function () {
    'use strict';

    function OrderServiceFormDirective($lcmaDialog, $uibModal, OrderService, InventorySite, InventoryFeature,
            InventoryPlan, Inventory, Route, Note, OrderServiceMissedReason, $broadcast, Dictionary) {

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                service: '=ngModel',
                type: '@type',
                order: '=order',
                onComplete: "&?onComplete"
            },
            template: '<div ng-include="url"></div>',
            controller: function ($scope, $lcmaGrid, $lcmAlert) {

              var _this = this;
              OrderServiceMissedReason.findAll().then(function(data){
                  $scope.serviceFlowScheme[1].dropdownValues = data;
              });
              
              Dictionary.getDictionary('inventory-status').then(function (data) {
                  _this.inventoryStatusList = data;                  
              });

              _this.service = $scope.service;
              _this.inventory = $scope.service.inventory;
              if (!_this.inventory) {
                  _this.inventory = {};
              }

              $scope.url = 'components/order-service/order-service-' + $scope.type + '.html';


              $scope.onFlowAction = function (item, action, data) {
                  var obj = {};
                  _this.service.state = action ? action.to : item.to;
                  if (_this.service.state === 20) {
                      _this.service.foc_rec_date = data.date;
                      _this.service.foc_date = data.date2;
                      obj = {state: _this.service.state, foc_rec_date: _this.service.foc_rec_date,
                          foc_date:_this.service.foc_date, reason:data.dropdown, note:data.note};
                  } else if (_this.service.state === 50) {
                      _this.service.install_date = data.date;
                      obj = {state: _this.service.state, install_date: _this.service.install_date};
                  } else if (_this.service.state === 63 || _this.service.state === 62) {
                      _this.service.accept_date = data.date; 
                      var t = _this.service.state;
                      if(t === 63){
                          _this.service.state = 600;                          
                      }
                      obj = {state: _this.service.state, accept_date: _this.service.accept_date, test_passed : t === 63, note:data.note};                      
                  } else {
                      obj = {state: _this.service.state};
                  }
                  
                  //inventory status update
                    if (t === 63) {                        
                        _this.service.inventory.status_id = _this.inventoryStatusList.filter(function (o) {
                            return o.value === "Active";
                        })[0].id;
                        Inventory.update(_this.service.inventory.id, {status_id: _this.service.inventory.status_id});                      
                    } else {
                        _this.service.inventory.status_id = _this.inventoryStatusList.filter(function (o) {
                            return o.value === "New";
                        })[0].id;
                        Inventory.update(_this.service.inventory.id, {status_id: _this.service.inventory.status_id});
                    }

                  OrderService.update(_this.service.id, obj).then(function (obj) {
                    _this.service.foc_date_history = obj.foc_date_history;
                    _this.service.accept_date_history = obj.accept_date_history;
                    if (data && data.note !== true && data.note !== "") {
                      var t = "";
                      if(action){
                        t=action.name;
                      }
                      var note =
                      {
                        entity_id: _this.service.order_id,
                        entity_type: "order",
                        content: item.dialogTitleText + " " + t + ": " + data.note
                      };
                      Note.create(note);
                    }
                    $scope.serviceFlowScheme[1].dropdown=_this.service.state>=20;
                    $scope.serviceFlowScheme[1].notRequiredNote=_this.service.state<20;
                    $scope.serviceFlowScheme[1].allwaysTrigger=_this.service.state>=10;
                    if(_this.service.state===600){
                        if($scope.onComplete){
                            $scope.onComplete();
                        }
                    }
                  });
              };

              $scope.serviceFlowScheme = [
                  {statuses: [
                          {key: 10, name: "Vendor Accepted", action: false}
                      ]
                  },
                  {
                      name: 'FOC Date',
                      key:20, 
                      dateField : true, dateFieldLabel:"FOC Receive Date", dateField2 : true, dateField2Label:"FOC Date",
                      dialogTitleText: "FOC Receive", dropdown:_this.service.state>=20, notRequiredNote:_this.service.state<20, dropdownDefaultKey:77, dropdownLabel:"Reason Missed",allwaysTrigger:_this.service.state>=10,
                      actions:[
                          {key: 'confirm', name: 'Submit', to: 20, class: "btn-success"}
                      ]
                  },
                  {key: 50, name: 'Service Install', to: 50, complex: true, complexType: 'date', dialogTitleText: "Service Installed"},
                  {
                      statuses: [
                          {
                              name: "Service Test", action: true, key: 60, dialogTitleText: "Test Passed",
                              dateField : true, dateFieldLabel:"Test Date",
                              actions: [
                                  {key: 'approve', name: 'Yes', to: 63, class: "btn-success"},
                                  {key: 'reject', name: 'No', to: 62, class: "btn-danger"}
                              ]
                          },
                          {key: 62, name: 'Test Failed', to: 62, action: true, allwaysTrigger: true, dialogTitleText: "Test Passed",
                              dateField : true, dateFieldLabel:"Test Date", classDanger:true,
                              actions: [
                                  {key: 'approve', name: 'Yes', to: 63, class: "btn-success"},
                                  {key: 'reject', name: 'No', to: 62, class: "btn-danger"}
                              ]
                          },
                          {key: 63, name: "Test Passed", to: 63, action:false}
                      ]
                  },
                  {key: 600, name: "Complete", to:600, dialogTitleText:"Complete", noPrev:62, action:false}
              ];

              var inventorySitesGrid = _this.inventorySitesGrid = $scope.inventorySitesGrid = $lcmaGrid({
                enableFiltering: false,
                enableSorting: false,
                multiSelect: false,
                onRegisterApi: function (api) {
                  _this.sitesGridApi = api;
                }
              })
                .addColumn('id', 'Site #')
                .addColumn('', 'Site ID', {
                  cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editSite(row.entity)">{{row.entity.site_id}}</a>'
                })
                .addColumn('vendor.name', 'Vendor')
                .addColumn('building.name', 'Building')
                .addColumn('type.value', 'Site Type')
                .addColumn('address1', 'Address1')
                .addColumn('address2', 'Address2')
                .addColumn('address3', 'Address3')
                .addColumn('city_state_zip', 'City/State/Zip', {
                  enableFiltering: true,
                  width: 180,
                  cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.city}}, {{row.entity.state}}, {{row.entity.zip}}</div>'
                })
                .options();


              var featuresGrid = _this.featuresGrid = $scope.featuresGrid = $lcmaGrid({
                enableFiltering: false,
                enableSorting: false,
                multiSelect: false,
                onRegisterApi: function (api) {
                  _this.featuresGridApi = api;
                }
              })
                .addColumn('', 'Feature #', {
                  cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editInventoryFeature(row.entity)">{{row.entity.id}}</a>'
                })
                .addColumn('type', 'Feature Type')
                .addColumn('code', 'Feature Code')
                .addColumn('description', 'Feature Description', {width: 200})
                .options();

              var plansGrid = _this.plansGrid = $scope.plansGrid = $lcmaGrid({
                enableFiltering: false,
                enableSorting: false,
                multiSelect: false,
                onRegisterApi: function (api) {
                  _this.planGridApi = api;
                }
              })
                .addColumn('', 'Feature Description', {
                  cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editInventoryPlan(row.entity)">{{row.entity.description}}</a>',
                  width: 300
                })
                .addColumn('monthly_cost', 'Monthly Cost')
                .options();

              /**
               * Route Grid
               */
              var routesGrid = _this.routesGrid = $lcmaGrid({
                enableFiltering: false,
                enableSorting: false,
                multiSelect: false,
                onRegisterApi: function (api) {
                  _this.routesGridApi = api;
                }
              })
                .addColumn('', 'LATA', {
                  cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editRoute(row.entity)">{{row.entity.lata}}</a>'
                })
                .addColumn('state', 'STATE')
                .addColumn('npa', 'NPA')
                .addColumn('nxx', 'NXX')
                .addColumn('cic_code', 'CIC Code')
                .addColumn('carrier', 'Carrier')
                .options();

              $scope.showDateHistory = function(type, defaultGrid, data){
                $uibModal.open({
                  templateUrl: 'app/order-services/date-history/list.html',
                  controller: 'DateHistoryListCtrl',
                  backdrop: 'static',
                  resolve: {
                    defaultGrid: function(){
                      return defaultGrid;
                    },
                    type: function(){
                      return type;
                    },
                    dates: function () {
                      return _this.service[data];
                    }
                  }
                });
              };


              /**
               * Initiates order removal.
               * @type {$scope.removeService}
               */
              _this.removeService = $scope.removeService = function (service) {
                  $lcmaDialog.confirm({
                      titleText: 'Please confirm',
                      bodyText: 'Are you sure you want to permanently remove this Service?'
                  }).result.then(function () {
                      OrderService.destroy(service.id).then(function () {
                         var index = $scope.order.services.map(function (o) {
                              return o.id;
                          }).indexOf(service.id);
                          $scope.order.services.splice(index, 1);
                          var note =
                                  {
                                      entity_id: _this.service.order_id,
                                      entity_type: "order",
                                      content: "Service removed: " + service.id
                                  };
                          Note.create(note);
                          $broadcast.emit("updated-order-service", service);
                      });
                  });
              };







              $scope.saveService = function (form) {
                  if (!form.$valid) {
                      return;
                  }
                  var service = _this.service;

                  //parareel update
                  Inventory.update(_this.inventory.id, _this.inventory).then(function (inventory) {
                      _this.service.inventory = inventory;
                      _this.inventory = inventory;
                      $broadcast.emit("updated-order-service", service);
                      OrderService.update(service.id, service).then(function () {
                        $lcmAlert.success('Inventory and Service updates successfully');
                    });
                  }, function(err){
                    if(err.data == "Duplicate unique id"){
                        $lcmAlert.error("Duplicate Inventory ID");
                    }
                });

                  
              };

              _this.addInventorySite = $scope.addInventorySite = function (site) {
                if (!site) {
                  $lcmAlert.success('Please select the site');
                  return;
                }

                _this.inventory.sites = _this.inventory.sites || [];

                if (-1 !== _.findIndex(_this.inventory.sites, {'id': site.id})) {
                  $lcmAlert.success('Site is already added');
                  return;
                }

                InventorySite.create(site, {params: {inventory_id: _this.inventory.id}})
                  .then(function (inventorySite) {

                    _this.inventory.sites.push(site);
                    inventorySitesGrid.data = _this.inventory.sites;

                  });

              };


              _this.editSite = $scope.editSite = function (site) {

                $uibModal.open({
                  templateUrl: 'app/sites/edit/site-edit.html',
                  controller: 'SiteEditCtrl',
                  backdrop: 'static',
                  resolve: {
                    $currentSite: function () {
                      return site;
                    }
                  }
                }).result.then(function (data) {
                  angular.extend(site, data);
                  $lcmAlert.success('Site info has been updated.');
                });

              };

              _this.removeSite = $scope.removeSite = function () {

                if (_this.sitesGridApi.selection.getSelectedRows().length === 0)
                  return;

                var site = _this.sitesGridApi.selection.getSelectedRows()[0];

                $lcmaDialog.confirm({
                  titleText: 'Please confirm',
                  bodyText: 'Are you sure you want to permanently remove this Site?'
                }).result.then(function () {
                  InventorySite.destroy(site, {params: {inventory_id: _this.inventory.id}})
                    .then(function () {
                      _.remove(_this.inventory.sites, function (ele) {
                        return ele.id === site.id;
                      });

                          inventorySitesGrid.data = _this.inventory.sites;
                    });
                });
              };

              /**
               * Initiates Order Service Feature create dialog
               */
              $scope.addOrderServiceFeature = function () {
                  $uibModal.open({
                      templateUrl: 'app/order-services/feature/feature-new.html',
                      controller: 'FeatureOrderServiceNewCtrl',
                      backdrop: 'static',
                      resolve: {
                          $currentOrderService: function () {
                              return $scope.service;
                          }
                      }
                  }).result.then(function (data) {
                      $scope.service.features = $scope.service.features || [];
                      $scope.service.features.push(data);
                      $lcmAlert.success('feature has been added');
                  });
              };


              /**
               * Remove feature from grid
               */
              $scope.removeOrderServiceFeature = function (feature) {

                  $lcmaDialog.confirm({
                      titleText: 'Please confirm',
                      bodyText: 'Are you sure you want to permanently remove this Feature?'
                  }).result.then(function () {
                      OrderServiceFeature.destroy(feature, {params: {order_service_id: $scope.service.id}})
                              .then(function () {
                                  _.remove($scope.service.features, function (ele) {
                                      return ele.id === feature.id;
                                  });
                              });
                  });

              };

              /**
               * Initiates feature plan creation dialog
               */
              _this.addInventoryPlan = function () {
                  $uibModal.open({
                      templateUrl: 'app/inventories/plan/plan-new.html',
                      controller: 'FeaturePlanNewCtrl',
                      windowClass: 'app-modal-window',
                      backdrop: 'static',
                      resolve: {
                          $currentInventory: function () {
                              return _this.inventory;
                          }
                      }
                  }).result.then(function (data) {
                      _this.inventory.plans = _this.inventory.plans || [];
                      _this.inventory.plans.push(data);
                      $lcmAlert.success('plan feature has been added');
                  });
              };

              /**
               * Edit inventory plan from grid
               */
              _this.editInventoryPlan = $scope.editInventoryPlan = function (plan) {

                $uibModal.open({
                  templateUrl: 'app/inventories/plan/plan-edit.html',
                  controller: 'FeaturePlanEditCtrl',
                  windowClass: 'app-modal-window',
                  backdrop: 'static',
                  resolve: {
                    $currentInventory: function () {
                      return _this.inventory;
                    },
                    $currentPlan: function () {
                      return plan;
                    }
                  }
                }).result.then(function (data) {
                    angular.extend(plan, data);
                    $lcmAlert.success('plan feature has been updated');
                  });

              };


              /**
               * Remove plan from grid
               */
              _this.removeInventoryPlan = $scope.removeInventoryPlan = function () {

                if (_this.planGridApi.selection.getSelectedRows().length === 0)
                  return;

                var plan = _this.planGridApi.selection.getSelectedRows()[0];

                $lcmaDialog.confirm({
                  titleText: 'Please confirm',
                  bodyText: 'Are you sure you want to permanently remove this Plan?'
                }).result.then(function () {
                  InventoryPlan.destroy(plan, {params: {inventory_id: _this.inventory.id}})
                    .then(function () {
                      _.remove(_this.inventory.plans, function (ele) {
                        return ele.id === plan.id;
                      });
                    });
                });
              };

              /**
               * Initiates Route Create Dialog
               */
              _this.addRoute = function () {

                  $uibModal.open({
                      templateUrl: 'app/inventories/route/route-new.html',
                      controller: 'RouteNewCtrl',
                      windowClass: 'app-modal-window',
                      backdrop: 'static',
                      resolve: {
                          $currentInventory: function () {
                              return _this.inventory;
                          }
                      }
                  }).result.then(function (data) {
                      _this.inventory.routes = _this.inventory.routes || [];
                      _this.inventory.routes.push(data);
                      $lcmAlert.success('Route has been added');
                  });
              };

              /**
              * Edit route from grid
              */
              _this.editRoute = $scope.editRoute = function (route) {

                $uibModal.open({
                  templateUrl: 'app/inventories/route/route-edit.html',
                  controller: 'RouteEditCtrl',
                  windowClass: 'app-modal-window',
                  backdrop: 'static',
                  resolve: {
                    $currentInventory: function () {
                      return _this.inventory;
                    },
                    $currentRoute: function () {
                      return route;
                    }
                  }
                }).result.then(function (data) {
                    angular.extend(route, data);
                    $lcmAlert.success('Route has been updated');
                  });

              };

              /**
               * Remove route from grid
               */
              _this.removeRoute = $scope.removeRoute = function () {

                if (_this.routesGridApi.selection.getSelectedRows().length === 0)
                  return;

                var route = _this.routesGridApi.selection.getSelectedRows()[0];

                $lcmaDialog.confirm({
                  titleText: 'Please confirm',
                  bodyText: 'Are you sure you want to permanently remove this Route?'
                }).result.then(function () {
                  Route.destroy(route, {params: {inventory_id: _this.inventory.id}})
                    .then(function () {
                      _.remove(_this.inventory.routes, function (ele) {
                        return ele.id === route.id;
                      });
                    });
                  });

              };

              /**
               * Initiates Inventory Feature create dialog
               */
              _this.addInventoryFeature = function () {
                $uibModal.open({
                    templateUrl: 'app/inventories/feature/feature-new.html',
                    controller: 'FeatureInventoryNewCtrl',
                    windowClass: 'app-modal-window',
                    backdrop: 'static',
                    resolve: {
                        $currentInventory: function () {
                            return _this.inventory;
                        }
                    }
                }).result.then(function (data) {
                    _this.inventory.features = _this.inventory.features || [];
                    _this.inventory.features.push(data);
                    $lcmAlert.success('feature has been added');
                });
              };


              /**
               * Remove feature from grid
               */
              _this.removeInventoryFeature = $scope.removeInventoryFeature = function () {

                if (_this.featuresGridApi.selection.getSelectedRows().length === 0)
                  return;
                var feature = _this.featuresGridApi.selection.getSelectedRows()[0];

                $lcmaDialog.confirm({
                  titleText: 'Please confirm',
                  bodyText: 'Are you sure you want to permanently remove this Feature?'
                }).result.then(function () {
                    InventoryFeature.destroy(feature, {params: {inventory_id: _this.inventory.id}})
                      .then(function () {
                        _.remove(_this.inventory.features, function (ele) {
                          return ele.id === feature.id;
                        });
                      });
                  });
              };

              /**
               * Edit feature from grid
               */
              _this.editInventoryFeature = $scope.editInventoryFeature = function (feature) {

                $uibModal.open({
                  templateUrl: 'app/inventories/feature/feature-edit.html',
                  controller: 'FeatureInventoryEditCtrl',
                  windowClass: 'app-modal-window',
                  backdrop: 'static',
                  resolve: {
                    $currentInventory: function () {
                      return _this.inventory;
                    },
                    $currentFeature: function () {
                      return feature;
                    }
                  }
                }).result.then(function (data) {
                    angular.extend(feature, data);
                    $lcmAlert.success('feature has been updated');
                  });


              };



              inventorySitesGrid.data = _this.inventory.sites;
              featuresGrid.data = _this.inventory.features;
              plansGrid.data = _this.inventory.plans;
              routesGrid.data = _this.inventory.routes;

            },
            controllerAs: 'ctx',
        };

    }

    angular.module('lcma')
            .directive('lcmaOrderServiceForm', OrderServiceFormDirective);


}());
