/**
 *
 */
(function () {
    'use strict';

  function InventoryNewCtrl($lcmaPage, $state, $stateParams, Inventory, Dictionary, $lcmAlert, inventoryObjectParams) {
    $lcmaPage.setTitle('New Inventory');
    
    var _this = this;

    _this.inventory = {
    };
    if(inventoryObjectParams){
        _this.inventory.sp_ckt_id = inventoryObjectParams;
    }

    // get inventory type id
    Dictionary.getDictionary('inventory-type').then(function(types) {
      var type = _.find(types, {custom_key: $stateParams.type});
      if (type) {
        _this.inventory.type_id = type.id;
      }
    });
    
    Dictionary.getDictionary('inventory-status').then(function(data) {
         _this.inventory.status_id = data.filter(function(o){
            return o.value === "Active";
        })[0].id;
    });

    //
    _this.createInventory = function (form) {

      form.$setSubmitted();

      if(!form.$valid) {
        return;
      }

      Inventory.create(_this.inventory).then(function (inventory) {
            $lcmAlert.success("Inventory has been created.");
            $state.go('app.inventoryEdit', {id: inventory.id});
      }, function(err){
            if(err.data == "Duplicate unique id"){
                $lcmAlert.error("Duplicate Inventory ID");
            }
        });

    };

    _this.cancelInventory = function () {
      $state.go('app.inventories');
    };


  }

  angular.module('lcma')
    .controller('InventoryNewCtrl', InventoryNewCtrl)

}());
