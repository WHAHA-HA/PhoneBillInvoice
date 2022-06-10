/**
 *
 */
(function () {
    'use strict';

  angular.module('lcma')
    .config(function ($stateProvider) {

      $stateProvider
        .state('app.inventories', {
          url: '/inventories',
          views: {
            'main@app' : {
              controller: 'InventoriesCtrl as ctx',
              templateUrl: 'app/inventories/list/inventory-list.html'
            }
          }
        })
        .state('app.inventoryNew', {
          url: '/inventories/new/:type',
          resolve:{
            inventoryObjectParams: function(){
                return null;
            }  
          },
          views: {
            'main@app' : {
              controller: 'InventoryNewCtrl as ctx',
              templateUrl: function($stateParams) {

                if ('ckt' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-circuit.html';
                }
                else if ('wireline' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-wireline.html';
                }
                else if ('mobile' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-mobile.html';
                }
                else if ('trunk' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-trunk.html';
                }
                else if ('mobile_device' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-mobile_device.html';
                }
                else if ('telephone_number' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-telephone_number.html';
                }
                else if ('toll_free_number' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-toll_free_number.html';
                }
              }
            }
          }
        })
        .state('app.inventoryEdit', {
          url: '/inventories/:id/edit',
          resolve: {
            $currentInventory: function ($stateParams, Inventory) {
              return Inventory.find($stateParams.id);
            }
          },
          views: {
            'main@app' : {
              controller: 'InventoryEditCtrl as ctx',

              templateUrl: function() {
                return 'app/inventories/edit/inventory-edit.html';
              }
            }
          }
        })
        .state('app.inventoryNewRecon', {
          url: '/inventories/new/:type/:params',
          resolve:{
            inventoryObjectParams: function($stateParams){
                return $stateParams.params;
            }  
          },
          views: {
            'main@app' : {
              controller: 'InventoryNewCtrl as ctx',
              templateUrl: function($stateParams) {

                if ('ckt' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-circuit.html';
                }
                else if ('wireline' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-wireline.html';
                }
                else if ('mobile' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-mobile.html';
                }
                else if ('trunk' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-trunk.html';
                }
                else if ('mobile_device' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-mobile_device.html';
                }
                else if ('telephone_number' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-telephone_number.html';
                }
                else if ('toll_free_number' === $stateParams.type) {
                  return 'app/inventories/new/inventory-new-toll_free_number.html';
                }
              }
            }
          }
        })
      ;

    });

}());
