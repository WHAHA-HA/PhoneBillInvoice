/**
 *
 */
(function () {
    'use strict';

    function InventoryEditCtrl($scope, $lcmaPage, $lcmAlert, $lcmaGrid, Inventory, Note, InventoryFeature, UnderlyingService, Route, Charge, InventoryGlStrings, Document, $timeout, $lcmaPager, 
                             $currentInventory, Site, InventorySite, $uibModal, $lcmaDialog, InventoryPlan, $state, ChargeBrowserService, GlString, $lcmaGridFilter, InventoryDocument) {
        $lcmaPage.setTitle('Edit Inventory');

        var _this = this;

        _this.inventory = $currentInventory;
        _this.selection =null;
        //Inventory notes
        _this.notes = [];


        $lcmaPage.setTitle('Inventory: ' + _this.inventory.id);

    /**
     * Retrieve all sites
     */
    Site.findAll().then(function (sites) {
      _this.sites = sites;
    });

    var sitesGrid = _this.sitesGrid = $lcmaGrid({
      enableFiltering: false,
      enableSorting: false,
      onRegisterApi: function (api) {
        _this.gridApi = api;
      }

    })
      .addCommandColumn('remove', ' ', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeSite(row.entity)"><i class="fa fa-trash"></i></a>',
      })
/*      .addColumn('', '#', {
        cellTemplate: '<div class="ui-grid-filter-container">{{$index}}</div>'
      })*/
      .addColumn('site_id', 'Site ID', {
        cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.site_id}}</div>'
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


    /**
     * Features Grid: in Wireline
     */

    var featuresGrid = _this.featuresGrid = $lcmaGrid({
      enableFiltering: false,
      enableSorting: false,
      onRegisterApi: function (api) {
        _this.gridApi = api;
      }

    })
      .addCommandColumn('remove', ' ', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeInventoryFeature(row.entity)"><i class="fa fa-trash"></i></a>',
      })
      .addColumn('', 'Feature #', {
       cellTemplate: '<div class="ui-grid-filter-container">{{row.entity.id}}</div>'
       })
      .addColumn('type', 'Feature Type')
      .addColumn('code', 'Feature Code')
      .addColumn('description', 'Feature Description', {width: 200})
      .options();


    /**
     * Plan Features Grid: in Wireless
     */

    var plansGrid = _this.plansGrid = $lcmaGrid({
      enableFiltering: false,
      enableSorting: false,
      onRegisterApi: function (api) {
        _this.gridApi = api;
      }

    })
      .addCommandColumn('remove', ' ', {
        cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeInventoryPlan(row.entity)"><i class="fa fa-trash"></i></a>',
      })
      .addColumn('description', 'Feature Description', {width: 200})
      .addColumn('monthly_cost', 'Monthly Cost')
      .options();


    _this.updateInventory = function (form) {

        form.$setSubmitted();

        if(!form.$valid) {
            return;
        }

        Inventory.update(_this.inventory.id, _this.inventory).then(function (inventory) {

            /**
             * Load Billing Grid again
            */
            _this.loadBillingData();
            $lcmAlert.success('Inventory info has been updated');
        }, function(err){
            if(err.data == "Duplicate unique id"){
                $lcmAlert.error("Duplicate Inventory ID");
            }
        });

        };


        /**
         * Initiates Inventory remove.
         */
        $scope.removeInventory = _this.removeInventory = function () {
          $lcmaDialog.confirm({
            titleText: 'Please confirm',
            bodyText: 'Are you sure you want to permanently remove this Inventory?'
          }).result.then(function () {
            Inventory.destroy(_this.inventory.id).then(function(){
                $lcmAlert.success('Inventory has been deleted');
                 $state.go('app.inventories');
            });
          });
        };


        /**
         * Underlying Service Grid
         */
        var underlyingServicesGrid = _this.underlyingServicesGrid = $lcmaGrid({
          enableFiltering: false,
          enableSorting: false,
          onRegisterApi: function (api) {
            _this.gridApi = api;
          }

        })
          .addCommandColumn('remove', ' ', {
            cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeUnderlyingService(row.entity)"><i class="fa fa-trash"></i></a>',
          })
          .addColumn('ckt_type', 'CKt Type')
          .addColumn('int_ckt_id', 'Int Ckt ID')
          .addColumn('sp_ckt_id', 'SP Ckt ID')
          .options();

        /**
         * Route Grid
         */
        var routesGrid = _this.routesGrid = $lcmaGrid({
          enableFiltering: false,
          enableSorting: false,
          onRegisterApi: function (api) {
            _this.gridApi = api;
          }

        })
          .addCommandColumn('remove', ' ', {
            cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeRoute(row.entity)"><i class="fa fa-trash"></i></a>',
          })
          .addColumn('lata', 'LATA')
          .addColumn('state', 'STATE')
          .addColumn('npa', 'NPA')
          .addColumn('nxx', 'NXX')
          .addColumn('cic_code', 'CIC Code')
          .addColumn('carrier', 'Carrier')
          .options();

        /**
        * Billing Grid in Related Info tab
        */
        var grid = _this.billingGrid = ChargeBrowserService.listGridSettings({
            settingKey: 'chargesGrid',
            exporterCsvFilename: 'invoices.csv',
            flatEntityAccess: true,
            enableRowHeaderSelection: true,
            enableSelectAll: true,
            fastWatch: true,
            onReady: function(event) {
                event.api.sizeColumnsToFit();
            },
            onRegisterApi: function (api) {

                _this.billingGridApi = api;
                
                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.chargeQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                    _this.loadBillingData();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.chargeQuery)
                            .applyAll(grid.columnDefs.filter(function (x) {
                                return x.enableFiltering;
                            }));

                    _this.loadBillingData();
                });

            }

        }).options();



        /**
         * add record to inventory_sites table
         * @param site
         */
        _this.addSite = function (site) {

          _this.inventory.sites = _this.inventory.sites || [];

          if (-1 !== _.findIndex(_this.inventory.sites, { 'id': site.id}) ){
            $lcmAlert.success('Site is already added');
            return;
          }

          InventorySite.create(site, {params: {inventory_id: _this.inventory.id}})
            .then(function (inventorySite) {
              _this.inventory.sites.push(site);
              sitesGrid.data = _this.inventory.sites;
            });
        };

        _this.removeSite = $scope.removeSite = function (site) {
          InventorySite.destroy(site, {params: {inventory_id: _this.inventory.id}})
            .then(function () {
              _.remove(_this.inventory.sites, function(ele) {
                return ele.id ===site.id;
              });
            });


        };


        /**
         * Opens add note dialog
         */
        _this.addNote = function () {

          $uibModal.open({
            templateUrl: 'app/note/new/note-new.html',
            controller: 'NoteNewCtrl',
            backdrop: 'static',
            resolve: {
              entityId: function () {
                return _this.inventory.id
              },
              entityType: function () {
                return 'inventory'
              },
              charges: function () {
                return [];
              }
            }
          })
            .result.then(function (newNote) {
              _this.notes.push(newNote);
              $lcmAlert.success('Note has been created');
            }, function () {


            });
        };

        /**
         * Sends reply to note.
         * @param note
         */
        _this.onNoteReply = function (note) {
          Note.create({
            entity_id: _this.inventory.id,
            parent_id: note.id,
            entity_type: 'inventory',
            content: note.$reply.content
          }).then(function (newNote) {
            delete note.$reply;

            if (!note.notes) {
              note.notes = [];
            }
            note.notes.push(newNote);
          });
        };

        /**
         * Queries : called as init function
         */
        _this.query = function() {

            sitesGrid.data = _this.inventory.sites;
            featuresGrid.data = _this.inventory.features;
            plansGrid.data = _this.inventory.plans;
            underlyingServicesGrid.data = _this.inventory.services;
            routesGrid.data = _this.inventory.routes;

            // Get notes for the inventory
            _this.notesQuery = {
            where: {
              entity_id: {'==': _this.inventory.id},
              entity_type: {'==': 'inventory'}
            }
            };

            Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
            _this.notes = notes;
            });

            Inventory.documents(_this.inventory.id).then(function (response) {
                _this.documents = response.data;
                _this.documentsGrid.data = _this.documents;
            });

            _this.loadBillingData();

        };
        
        _this.chargeQuery = {
              where: {
                  sp_serv_id: {'=': _this.inventory.sp_ckt_id},
                  
              }

          };

        _this.loadBillingData = function() {
          /**
           * Load detail for billing grid
           */
          //,"inv_date":{">":"2016-07-03"},

          // get 6 month prior date

          var inv_date = new Date();
          inv_date.setMonth(inv_date.getMonth() - 36);

          var strDate = inv_date.getFullYear()
              + '-' + ("0" + (inv_date.getMonth() + 1)).slice(-2)
              + '-' + ("0" + (inv_date.getDate())).slice(-2);
              
          _this.chargeQuery.where.inv_date = {'>': strDate};          

          //  http://localhost:9000/api/charge/filters?filter={"where":{"sp_serv_id":{"likei":"2155535112%"},"inv_date":{">":"2013-07-14"}},"limit":50,"offset":0}
          /// http://localhost:9000/api/charge/filters?filter={"where":{"sp_serv_id":"2155535112","inv_date":{">":"2013-07-14"}}}

          Charge.filters(
              {
                  params: {filter: JSON.stringify(_this.chargeQuery)}
              }
          )
              .then(function (response) {
                  if (response.status === 200) {
                      _this.billingGrid.data = response.data.items;
                  }
              });
        };


        /**
         * Initiates Inventory Feature create dialog
         */
        _this.addInventoryFeature = function () {
          $uibModal.open({
            templateUrl: 'app/inventories/feature/feature-new.html',
            controller: 'FeatureInventoryNewCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window',
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
        _this.removeInventoryFeature = $scope.removeInventoryFeature = function (feature) {

          $lcmaDialog.confirm({
            titleText: 'Please confirm',
            bodyText: 'Are you sure you want to permanently remove this Feature?'
          }).result.then(function () {
            InventoryFeature.destroy(feature, {params: {inventory_id: _this.inventory.id}})
              .then(function () {
                _.remove(_this.inventory.features, function(ele) {
                  return ele.id ===feature.id;
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
            backdrop: 'static',
            windowClass: 'app-modal-window',
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
         * Remove plan from grid
         */
        _this.removeInventoryPlan = $scope.removeInventoryPlan = function (plan) {

          $lcmaDialog.confirm({
            titleText: 'Please confirm',
            bodyText: 'Are you sure you want to permanently remove this Plan?'
          }).result.then(function () {
            InventoryPlan.destroy(plan, {params: {inventory_id: _this.inventory.id}})
              .then(function () {
                _.remove(_this.inventory.plans, function(ele) {
                  return ele.id ===plan.id;
                });
              });
          });

        };

        /**
         * Initiates Underlying Service Create Dialog
         */
        _this.addUnderlyingService = function () {

          $uibModal.open({
            templateUrl: 'app/inventories/service/service-new.html',
            controller: 'UnderlyingServiceNewCtrl',
            backdrop: 'static',
            windowClass: 'app-modal-window',
            resolve: {
              $currentInventory: function () {
                return _this.inventory;
              }
            }
          }).result.then(function (data) {
              _this.inventory.services = _this.inventory.services || [];
              _this.inventory.services.push(data);
              $lcmAlert.success('Underlying Service has been added');
            });
        };

        /**
         * Remove Underlying service from grid
         */
        _this.removeUnderlyingService = $scope.removeUnderlyingService = function (service) {
          $lcmaDialog.confirm({
            titleText: 'Please confirm',
            bodyText: 'Are you sure you want to permanently remove this Underlying Service?'
          }).result.then(function () {
              UnderlyingService.destroy(service, {params: {inventory_id: _this.inventory.id}})
                .then(function () {
                  _.remove(_this.inventory.services, function(ele) {
                    return ele.id ===service.id;
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
            backdrop: 'static',
            windowClass: 'app-modal-window',
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
         * Remove route from grid
         */
        _this.removeRoute = $scope.removeRoute = function (route) {

          $lcmaDialog.confirm({
            titleText: 'Please confirm',
            bodyText: 'Are you sure you want to permanently remove this Route?'
          }).result.then(function () {
              Route.destroy(route, {params: {inventory_id: _this.inventory.id}})
                .then(function () {
                  _.remove(_this.inventory.routes, function(ele) {
                    return ele.id ===route.id;
                  });
                });
            });


        };

        var documentsGrid = _this.documentsGrid = $lcmaGrid({
            enableFiltering: false,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableSorting: false,
            onRegisterApi: function (api) {
                _this.documentsGridApi = api;
            }

        })
            .addColumn('path', 'Document Name', {
                cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.readDocument(row.entity)">{{row.entity.path}}</a>',
                width: 350
            })
            .addColumn('type', 'Type', {
                width: 100
            })
            .addColumn('description', 'Description', {
                width: 350
            })
            .addColumn('contract_type_id', 'Contract Type', {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.contract_type.value}}</div>',
                width: '*'
            })
            .addDateColumn('effective_date', 'Effective Date',{
                width: '*'
            })
            .addColumn('term', 'Term (Months)',{
                width: '*'
            })
            .addDateColumn('exp_date', 'Expiration Date',{
                width: '*'
            })
            .addColumn('mrc', 'MRC',{
                width: 80
            })
            .addColumn('nrc', 'NRC',{
                width: 80
            })
            .options();

        /**
        * Initiates add document dialog
        */
        _this.addDocument = function () {
            $uibModal.open({
                templateUrl: 'app/inventories/document-manager/inventory-document-manager.html',
                controller: 'InventoryDocumentManagerCtrl',
                backdrop: 'static',
                resolve: {
                    $entity: function () {
                        return  _.assign(_.clone(_this.inventory), {parent_type: 'inventory'});
                    },
                    $settings: function () {
                        return {title: "Set Inventory Document"};
                    },
                    $document: function () {
                        return null;
                    },
                    $folder: function () {
                        return "inventories";
                    }
            }
            }).result.then(function (data) {
                _this.documents.push(data);
                $lcmAlert.success('Document has been added');
            });
        };

        $scope.removeEntityDocument = function () {
            if (_this.documentsGridApi.selection.getSelectedRows().length === 0)
                return;
            var doc = _this.documentsGridApi.selection.getSelectedRows()[0];
            $lcmaDialog.remove({
                message: ' Document ' + doc.path
            }).result.then(function () {

                InventoryDocument.destroy(doc, {params: {inventory_id: _this.inventory.id}}).then(function () {
                    Inventory.documents(_this.inventory.id).then(function (response) {
                        _this.documents = response.data;
                        _this.documentsGrid.data = _this.documents;
                    });
                });
            });
        };

        _this.readDocument = $scope.readDocument = function (doc, open) {
            Inventory.getAdapter('http').GET('/api/inventory/' + _this.inventory.id + '/document/' + doc.id + '/download', {
                responseType: 'arraybuffer'
            })
            .then(function (response) {
                var blob = new Blob([response.data], {type: doc.type});
                var objectUrl = URL.createObjectURL(blob);

                if (open === true) {
                    window.open(objectUrl);
                } else {

                    var save = document.createElement('a');
                    save.href = objectUrl;
                    save.target = '_blank';
                    save.download = doc.path;
                    var event = document.createEvent("MouseEvents");
                    event.initMouseEvent(
                      "click", true, false, window, 0, 0, 0, 0, 0
                      , false, false, false, false, 0, null
                    );
                    save.dispatchEvent(event);
                }
            }, function (err) {
                $lcmAlert.error('Document is not available.');
            });
        };


        /**
        * Activate related items tab
        * @param tab
        */
        _this.activateRelatedTab = function (tab) {
            _this.relatedTabs = {active: tab};
        };

        _this.activateRelatedTab('orders');


        // calling initial function
        _this.query();
        
        _this.saveGlStrings = function(){
            var t = [];
            var s = gridSelectedStringsOptions.data;
            for(var i in s){
                var o = {
                    inv_id: _this.inventory.id,
                    gl_string_id: s[i].gl_string_id || s[i].id,
                    apportion_pct: s[i].apportion_pct
                };
                if(s[i].id && s[i].gl_string_id){
                    o.id = s[i].id;
                }
                if(s[i].id){
                    t.push(o);
                }
            }
            InventoryGlStrings.save({data:{inv: _this.inventory.id, values :t}}).then(function(data){
                $lcmAlert.success("GL Strings have been succesfully saved.")
                _this.loadInventoryGlStrings();
            });
        };

        _this.glStringPager = $lcmaPager({
            onGo: function () {
                _this.glStringQuery.limit = _this.glStringPager.size;
                _this.glStringQuery.offset = _this.glStringPager.from() - 1;
                _this.refreshGlStrings();
            }
        });
        
        _this.glStringQuery = {
            where: {},
            limit: _this.glStringPager.size,
            offset: this.glStringPager.from() - 1
        };

        var gridStringsOptions = _this.gridStringsOptions = $lcmaGrid({
            multiSelect: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableFiltering: false,
            enableSorting: false,
            rowEquality: function (x, y) {  
                if(y.gl_string_id && !x.gl_string_id) {
                    return y.gl_string_id === x.id;
                }
                return x.id === y.id;
            },
            onRegisterApi: function (api) {

                _this.gridStringsOptionsApi = api;

                api.core.on.sortChanged($scope, function (grid, columns) {
                    _this.glStringQuery.orderBy = columns.map(function (x) {
                        return [x.field, x.sort.direction.toUpperCase()];
                    });

                    _this.refreshGlStrings();
                });

                api.core.on.filterChanged($scope, function (x) {

                    $lcmaGridFilter(this.grid, _this.glStringQuery)
                            .applyAll(gridStringsOptions.columnDefs.filter(function (x) {
                                return x.enableFiltering;
                            }));

                    _this.refreshGlStrings();
                });

                api.selection.on.rowSelectionChanged($scope, function (row) {
                    var existingRow = findRowByEntityId1(_this.gridSelectedStringsOptions.data, row.entity.id);
                    row.entity.apportion_pct = 0;
                    if (row.isSelected && !existingRow) {
                        _this.gridSelectedStringsOptions.data.push(row.entity);
                        $timeout(function () {
                            _this.gridSelectedStringsOptionsApi.selection.selectRow(row.entity);
                        });

                    } else if (!row.isSelected && existingRow) {
                        _this.gridSelectedStringsOptions.data.splice(existingRow.index, 1);
                    }

                });

            }

        })
                .addColumn('full_string_formatted', "Full GL String", {width: 250})
                .addColumn('full_string_text', "GL String Desc", {width: 250})
                .options();

        var gridSelectedStringsOptions = _this.gridSelectedStringsOptions = $lcmaGrid({
            multiSelect: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableFiltering: false,
            enableSorting: false,
            rowEquality: function (x, y) {
                if(x.gl_string_id && !y.gl_string_id) {
                    return x.gl_string_id === y.id;
                }
                return x.id === y.id;
            },
            onRegisterApi: function (api) {

                _this.gridSelectedStringsOptionsApi = api;

                api.selection.on.rowSelectionChanged($scope, function (row) {
                    if (!row.isSelected) {
                        var id = row.entity.gl_string_id || row.entity.id;
                        var existingRow = findRowByEntityId1(_this.gridSelectedStringsOptions.data, id);
                        _this.gridSelectedStringsOptions.data.splice(existingRow.index, 1);
                        _this.gridStringsOptionsApi.selection.unSelectRow(row.entity);
                    }
                });
            }

        })
                
                .addColumn('gl_string.full_string_formatted', "Full GL String", {
                    width: 180,
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.gl_string.full_string_formatted || row.entity.full_string_formatted}}</div>'
                })
                .addColumn('gl_string.full_string_text', "GL String Desc", {
                    cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.gl_string.full_string_text || row.entity.full_string_text}}</div>',
                    width: 180
                })
                .addNumberColumn('apportion_pct', "Charge %", {enableCellEdit: true, width: 100})
                .options();

        _this.refreshGlStrings = function () {
            GlString.findAll({filter: JSON.stringify(_this.glStringQuery)}).then(function (data) {
                gridStringsOptions.data = data;
                _this.glStringPager.total = data.$total;
            });
        };
        
        
        function findRowByEntityId1(list, gl_string_id) {
            for (var i = 0, l = list.length; i < l; i++) {
                if((list[i].gl_string_id || list[i].id) === gl_string_id) {
                    return {item: list[i], index: i};
                }
            }
        }
        
        function restoreSelection(gridApi, selections) {
            angular.forEach(selections, function (row) {
                gridApi.selection.selectRow(row);
            });
        }
        
        _this.loadInventoryGlStrings = function(){
            InventoryGlStrings.findAll({filter:{
                    where: {
                        inv_id : {'===' : _this.inventory.id}
                    }
            }}, {bypassCache: true}).then(function(data){
                gridSelectedStringsOptions.data = data;
                $timeout(function () {
                    restoreSelection(_this.gridStringsOptionsApi, data);
                    restoreSelection(_this.gridSelectedStringsOptionsApi, data);
                  }, 50);
            });
        };
        
        _this.gl_code_sum = function(){
            var s = 0;
            if(!gridSelectedStringsOptions.data) return 0;
            var t = gridSelectedStringsOptions.data.map(function(o){
                return o.apportion_pct;
            });
            for(var e in t){
                s+= Number(t[e]);
            }
            return s;
        };
        
        _this.loadInventoryGlStrings();
        _this.refreshGlStrings();
    }

    angular.module('lcma')
        .controller('InventoryEditCtrl', InventoryEditCtrl)

}());
