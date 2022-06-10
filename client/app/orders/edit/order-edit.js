/**
 *
 */
(function () {
    'use strict';

    function OrderEditCtrl($scope, $lcmaPage, $uibModal, $lcmAlert, $currentOrder, $lcmaDialog, $lcmaGrid, Order, OrderService, Inventory, Document,
            OrderRejectReason, Note, Dictionary, $broadcast, $state, $document, $timeout) {
        $lcmaPage.setTitle('Edit Order');

        var _this = this;
        OrderRejectReason.findAll().then(function (data) {
            $scope.orderFlowScheme[2].dropdownValues = data;
        });
        var order = _this.order = angular.copy($currentOrder);
        $scope.order = _this.order;
        if (_this.order.requester) {
            _this.requester = _this.order.requester.first_name + ' ' + _this.order.requester.last_name;
        }
        _this.services = [];
        _this.orderServiceTypes = [];

        _this.onServiceComplete = function () {
            var completed = true;
            for (var i = 0; i < _this.order.services.length; i++) {
                completed = completed && (_this.order.services[i].state === 600);
            }
            if (completed) {
                _this.order.state = 600;
                _this.order.complete_date = new Date();
                Order.update(_this.order.id, {state: _this.order.state, complete_date: new Date()}).then(function(){
                    $lcmAlert.success("Order is completed.");
                });
            }
        };

        $scope.onFlowAction = function (item, action, data) {
            var t = action ? action.to : item.to;

            _this.order.state = t;
            var obj = {state: _this.order.state};
            if (t === 20) {
                _this.order.ready_for_approval = new Date();
                obj.ready_for_approval = new Date();
            }
            if (t === 110) {
                _this.order.send_date = new Date();
                obj.send_date = new Date();
                $timeout(function () {
                    $lcmAlert.success("Order Sent to Vendor");
                }, 1000);
            }
            if (t === 150) {
                _this.order.ack_date = data.date;
                obj.ack_date = data.date;
            }
            if (t === 80) {
                _this.order.approve_date = new Date();
                obj.approve_date = new Date();
            }
            if (t === 220) {
                _this.order.vendor_reject_date = data.date;
                obj.vendor_reject_date = data.date;
            }
            if (t === 206) {
                _this.order.vendor_accept_date = data.date;
                obj.vendor_accept_date = data.date;
            }
            Order.update(_this.order.id, obj).then(function (order) {
                if ((data && data.note !== true && data.note !== "") || data.dropdown) {
                    if (data.dropdown && t === 4) {
                        data.note = data.dropdown.value + ': ' + data.note;
                    }
                    var note =
                            {
                                entity_id: _this.order.id,
                                entity_type: "order",
                                content: (action ? action.noteLabel : '' || item.dialogTitleText) + ": " + data.note
                            };
                    Note.create(note).then(function (note) {
                        _this.notes.push(note);
                    });
                }
                if (t === 206) {
                    for (var i in _this.order.services) {
                        _this.order.services[i].state = 10;
                        _this.order.services[i].accept_date = _this.order.accept_date;
                        _this.order.services[i].accepted_by = $scope.$me.id;
                        _this.order.services[i].accepted_by_user = $scope.$me;
                        var obj = {state: 10, accept_date: _this.order.accept_date, accepted_by: $scope.$me.id};
                        OrderService.update(_this.order.services[i].id, obj);
                    }
                }
            });

        };

        $scope.orderFlowScheme = [
            {
                name: 'New',
                statuses: [
                    {key: 1, name: "New", input: true, noNote: true, reasonAfter: 206, dialogTitleText: 'Cancel Order', actions: [
                            {key: 0, name: "Confirm", to: 300, class: "btn-danger"}
                        ]},
                    {key: 4, name: "New (Rejected)", action: false, classDanger: true, }
                ]
            },
            {
                statuses: [
                    {key: 20, name: "Ready for Approval", action: true, to: 20, dialogTitleText: "Ready for Approval", triggerActionsAfter: 4,
                        actions: [
                            {key: 'approve', name: 'Yes', to: 6, class: "btn-success", noteLabel: "Order Ready For Approval"},
                            {key: 'reject', name: 'Cancel Order', to: 300, class: "btn-danger", noteLabel: "Order Canceled"}
                        ]},
                    {key: 6, name: "Ready for Approval (Prior Reject)"}
                ]
            },
            {
                key: 80,
                name: 'Approved',
                noPrev: 4,
                actionName: 'Approve/Reject',
                dialogTitleText: 'Approve/Reject Order',
                dropdown: true,
                dropdownDefaultKey: 74,
                dropdownLabel: "Select Rejection Reason:",
                dropdownValues: [],
                actions: [
                    {key: 'approve', name: 'Approve', to: 80, class: "btn-success", noteLabel: "Order Approved"},
                    {key: 'reject', name: 'Reject', to: 4, requireReason: false, class: "btn-danger", noteLabel: "Order Rejected"}
                ]
            },
            {
                statuses: [
                    {key: 100, name: "Send to Vendor", to: 110, noPrev: 4, dialogTitleText: 'Send Order to Vendor',
                        dialogBodyText: 'Send order ' + _this.order.id + ' to ' + (_this.order.vendor ? _this.order.vendor.name : "") + '?',
                        triggerActionsAfter: 220, action: true, allwaysTrigger: false,
                        actions: [
                            {key: 'approve', name: 'Send to Vendor (Rework)', to: 120, class: "btn-success"},
                            {key: 'reject', name: 'Cancel', to: 300, class: "btn-danger"}
                        ]},
                    {key: 110, name: "Sent to Vendor", to: 100, dialogTitleText: 'Order State Change', noteLabel: 'Sent to Vendor'},
                    {key: 120, name: 'Sent to Vendor (Rework)', dialogTitleText: 'Order State Change', noteLabel: "Sent to Vendor (Rework)"}

                ]
            },
            {
                statuses: [
                    {key: 150, name: "Vendor Ack Date", to: 150, complex: true, complexType: 'date', dialogTitleText: "Vendor Ack Date"}
                ]
            },
            {
                statuses: [
                    {key: 204, name: "Vendor Accept/Reject", dialogTitleText: "Vendor Accept",
                        dateField: true, actions: [
                            {key: 'approve', name: "Yes", to: 206, class: "btn-success", noteLabel: "Vendor Accepted"},
                            {key: 'reject', name: 'No', to: 220, requireReason: false, class: "btn-danger", noteLabel: "Vendor Rejected"}
                        ]
                    },
                    {key: 220, name: "Vendor Reject"},
                    {key: 206, name: "Vendor Accept Received"}
                ]
            },
            {
                statuses: [
                    {key: 600, name: "Complete", to: 600, noPrev: 220, action: false},
                    {key: 300, name: "Cancelled", to: 300}
                ]
            }
        ];

        /**
         * Holds grid settings
         * @type {settings}
         */
        /*    var servicesGrid = _this.servicesGrid = $lcmaGrid({
         exporterCsvFilename: 'invoices.csv',
         enableFiltering: false,
         
         onRegisterApi: function (api) {
         _this.servicesGridApi = api;
         }
         })
         /!*      .addCommandColumn('edit', 'Edit', {
         cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editOrder({id: row.entity.id})"><i class="fa fa-pencil"></i></a>'
         })*!/
         .addCommandColumn('remove', 'remove', {
         cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeService(row.entity, $index)"><i class="fa fa-trash"></i></a>'
         })
         .addColumn('id', 'Service #')
         .addColumn('type', 'Type')
         .addColumn('topology', 'Topology')
         .addDateColumn('ack_date', 'Ack Date')
         .options();
         
         servicesGrid.data = _this.order.services;*/

        _this.expandCollapse = false;
        _this.expandCollapseAll = function () {
            _this.expandCollapse = !_this.expandCollapse;
            for (var i in _this.order.services) {
                var t = _this.order.services[i].id;
                if (!_this.services[t]) {
                    _this.services[t] = {};
                }
                _this.services[t].open = _this.expandCollapse;

            }
        };

        _this.saveOrder = function (form) {

            form.$setSubmitted();

            if (!form.$valid) {
                return;
            }
            
            var saveOrder = angular.copy(order);
            delete saveOrder.processor;
            delete saveOrder.requester;
            delete saveOrder.vendor;

            Order.update(order.id, saveOrder).then(function (order) {
                if(order.vendor){
                   $scope.orderFlowScheme[3].statuses[0].dialogBodyText = 'Send order ' + order.id + ' to ' + order.vendor.name + '?';
                }
                $lcmAlert.success('Order has been updated successfully.');
            })

        };

        var serviceSitesGrid = _this.serviceSitesGrid = $lcmaGrid({
            enableFiltering: false,
            enableSorting: false,
            onRegisterApi: function (api) {
                _this.gridApi = api;
            }

        })
                .addCommandColumn('remove', 'remove', {
                    cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.removeSite(row.entity, $index)"><i class="fa fa-trash"></i></a>',
                })
                .addColumn('id', 'Site #')
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
       
        _this.findTopology = function(item){
            _this.inventory.topology = _this.topology.filter(function(o){
                return o.id == _this.inventory.topology_id;
            })[0];
        };
                
          Dictionary.getDictionary('inventory-topology').then(function (topology) {
            _this.topology = topology;
          });

        _this.appendService = function (type) {

            _this.service = {
                order_id: order.id
            };

            if (type.custom_key === 'ckt') {
                _this.inventory = {
                    topology_id: null,
                    type_id: type.id,
                    sites: [],
                    features: [],
                    vendor_id: order.vendor_id
                };
            } else {
                _this.inventory = {
                    type_id: type.id,
                    vendor_id: order.vendor_id
                };
            }

            $timeout(function () {
                var newInventoryEle = angular.element(document.getElementById('new-inventory'));

                if (newInventoryEle && newInventoryEle.length > 0) {
                    var container = angular.element(document.getElementById('app-data'));
                    container.scrollToElement(newInventoryEle, 100, 2000);
                }
            });





        };


        _this.getServiceType = function (type_id) {
            var type = _.find(_this.orderServiceTypes, {id: type_id});
            return type;
        };


        _this.discardNewService = function () {
            _this.service = null;
            _this.inventory = null;
        };

        /**
         * Initiates order removal.
         * @type {$scope.removeOrder}
         */
        _this.removeOrder = $scope.removeOrder = function () {
            $lcmaDialog.confirm({
                titleText: 'Please confirm',
                bodyText: 'Are you sure you want to permanently remove this Order?'
            }).result.then(function () {
                Order.destroy(_this.order.id);
                $state.go('app.orders');
            });
        };


        _this.addNewService = function (form) {

            form.$setSubmitted();

            if (!form.$valid) {
                return;
            }

            /**
             * Create Inventory First and then create OrderService
             */
             Dictionary.getDictionary('inventory-status').then(function (data) {
                _this.inventory.status_id = data.filter(function (o) {
                    return o.value === "New";
                })[0].id;
                Inventory.create(_this.inventory).then(function (inventory) {
                    _this.service.inventory_id = inventory.id;
                    OrderService.create(_this.service).then(function (service) {

                        _this.order.services = _this.order.services || [];
                        _this.order.services.push(service);
                        _this.recalculateOrder();
                        _this.service = null;
                        _this.inventory = null;
                        $lcmAlert.success('Order service and Inventory have been created successfully.');
                    });
                }, function (err) {
                    if (err.data == "Duplicate unique id") {
                        $lcmAlert.error("Duplicate Inventory ID");
                    }
                });
            });

        };

        $broadcast.on("updated-order-service", function (data) {
            for (var i in  _this.order.services) {
                if (_this.order.services[i].id == data.id) {
                    _this.order.services[i] = data;
                }
            }
            _this.recalculateOrder();
        });
        
        _this.hasServices = function(){
            return _this.order.services.filter(function (x) {
                return x.active;
            }).length>0;
        };

        _this.recalculateOrder = function () {
            var services = _this.order.services;
            var mrc = 0;
            var nrc = 0;
            for (var i in services) {
                if (services[i].inventory && services[i].active) {
                    if (services[i].inventory.est_mrc)
                        mrc += Number(_this.order.services[i].inventory.est_mrc);
                    if (services[i].inventory.est_nrc)
                        nrc += Number(_this.order.services[i].inventory.est_nrc);
                }
            }
            _this.order.tot_svc_items = services.filter(function (x) {
                return x.active;
            }).length;
                _this.order.est_mrc = mrc;
                _this.order.est_nrc = nrc;
        };

        /*
         * notes
         */

        _this.activateNotesTab = function () {
            //_this.queryHistory();
        };

        /**
         * Holds list of notes.
         */
        _this.notes = [];

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
                        return _this.order.id;
                    },
                    entityType: function () {
                        return 'order';
                    },
                    charges: function () {
                        return [];
                    }
                }
            }).result.then(function (newNote) {
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
                entity_id: _this.order.id,
                parent_id: note.id,
                entity_type: 'order',
                content: note.$reply.content
            }).then(function (newNote) {
                delete note.$reply;
                if (!note.notes)
                    note.notes = [];
                note.notes.push(newNote);
            });
        };

        _this.notesQuery = {
            where: {
                entity_id: {'==': _this.order.id},
                entity_type: {'==': 'order'}
            }
        };

        Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
            _this.notes = notes;

        });

        Dictionary.getDictionary('order-service-type')
                .then(function (items) {
                    _this.orderServiceTypes = items;
                });

        _this.activateRelatedTab = function (tab) {
            _this.relatedTabs = {active: tab};
        };

        _this.activateRelatedTab('documents');        

    }

    angular.module('lcma')
            .controller('OrderEditCtrl', OrderEditCtrl)

}());
