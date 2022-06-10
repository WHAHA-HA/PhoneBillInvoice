'use strict';

angular.module('lcma')
    .controller('ContractShowCtrl', function ($scope, $state, $lcmAlert, $lcmaDialog, $stateParams, $lcmaGrid, $lcmaPage, $uibModal, Contract, ContractSection, Document, Note,
                                            uiGridConstants, Dictionary, Vendor, Site) {

        $lcmaPage.setTitle('Contract');

        var _this = this;


        /**
         * Holds list of contract sections.
         */
        _this.sections = [];

        /**
         * Holds list of contract documents.
         */
        _this.documents = [];

        /**
         * Holds list of contract notes.
         */
        _this.notes = [];

        /**
         * Holds disputes grid api
         */
        _this.sectionsGrid = $lcmaGrid({

          enableRowSelection: true,
          enableRowHeaderSelection: true,
          enableSorting: false,
          enableFiltering: false,
           onRegisterApi: function (api) {

            _this.gridApi = api;
            }
        })

          .addCommandColumn('edit', ' ', {
            cellTemplate: '<a class="ui-grid-cell-contents" ng-click="grid.appScope.editContractSection(row.entity)"><i class="fa fa-pencil"></i></a>'

          })
          .addColumn('name', 'Name', {width: 200})
          .addColumn('key', 'Section ID')
          .addDateColumn('text', 'Contract Text', {
            width: 300,
            cellTemplate: '<div class="ui-grid-cell-contents"  uib-popover="{{row.entity.text}}" popover-trigger="mouseenter" popover-append-to-body="true">{{row.entity.text}}</div>'
          })
          .addDateColumn('abstract', 'Abstract', {
            width: 300,
            cellTemplate: '<div class="ui-grid-cell-contents" uib-popover="{{row.entity.abstract}}" popover-trigger="mouseenter" popover-append-to-body="true">{{row.entity.abstract}}</div>'

          })
          .options()
        ;
        
        
        _this.inventoriesGrid = $lcmaGrid({
            settingKey: 'inventory.list.grid',
            exporterCsvFilename: 'inventories.csv',
            enableSorting: false,
            enableFiltering: false,
            onRegisterApi: function (api) {
                _this.inventoriesGridApi = api;
            }

        })
            .addColumn('sp_svc_id', 'SPID', {
                cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="app.inventoryEdit({id: row.entity.id, type: row.entity.type.custom_key})">{{row.entity.sp_svc_id}}</a></div>',
            })
            .addColumn('type_id', "Type", {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.type.value}}</div>',
                width: 350
            })
            .addColumn('vendor_id', "Vendor", {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.vendor.name}}</div>'
            })
            .addColumn('internal_id', 'Internal ID')
            .addDateColumn('install_date', 'Install Date')
            .addColumn('site_a_id', "Site A", {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.siteA.site_id}}</div>'
            })
            .addColumn('site_z_id', "Site Z", {
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.siteZ.site_id}}</div>'
            })
            .options();



        /**
         * Initiates contract edit dialog
         */
        _this.editContract = function () {
          $uibModal.open({
            templateUrl: 'app/contracts/edit/contract-edit.html',
            controller: 'ContractEditCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
              $currentContract: function () {
                return _this.contract;
              }
            }
          }).result.then(function (data) {
            angular.extend(_this.contract, data);
            $lcmAlert.success('Contract info has been updated');
          });
        };

        /**
         * Initiates contract section edit dialog
         */
        $scope.editContractSection = _this.editContractSection = function (section) {
          $uibModal.open({
            templateUrl: 'app/contracts/section-edit/section-edit.html',
            controller: 'ContractSectionEditCtrl',
            backdrop: 'static',
            resolve: {
              $currentSection: function () {
                return section;
              }
            }
          }).result.then(function (data) {
            angular.extend(section, data);
            $lcmAlert.success('Contract section info has been updated');
          });
        };

        /**
         * Initiates delte contract section dialog.
         * @param section
         */
        $scope.removeContractSection = function () {
            if (_this.gridApi.selection.getSelectedRows().length === 0)
                    return;
                var section = _this.gridApi.selection.getSelectedRows()[0];
                $lcmaDialog.remove({
                    message: ' Contract Section ' + section.name
          }).result.then(function () {
            ContractSection.destroy(section.id, {params: {contract_id: section.contract_id}});
          });
        };

        _this.readDocument = $scope.readDocument = function (doc, open) {
          Contract.getAdapter('http').GET('/api/document/' + doc.id + '/download/contracts', {
              responseType: 'arraybuffer'
            })
            .then(function (response) {
              var blob = new Blob([response.data], {type: doc.type});
              var objectUrl = URL.createObjectURL(blob);
              if(open === true){
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
          }, function(err){
              $lcmAlert.error('Contract document is not available.');
          });
        };


        /**
         * Initiates contract add document dialog
         */
        _this.setDocument = function () {
          $uibModal.open({
            templateUrl: 'app/contracts/document-manager/document-manager.html',
            controller: 'ContractDocumentManagerCtrl',
            backdrop: 'static',
            resolve: {
              $currentContract: function () {
                return _this.contract;
              },
              $settings: function () {
                return {};
              },
              $folder : function(){
                return "contracts";
              }
            }
          }).result.then(function (data) {
            angular.extend(_this.contract, data);
            $lcmAlert.success('Contract document has been updated');
          });
        };

        

        $scope.removeContractDocument = _this.removeContractDocument= function (contract) {
          $lcmaDialog.confirm({
            titleText: 'Please confirm',
            bodyText: 'Are you sure you want to permanently remove this document?'
          }).result.then(function () {
            Contract.deleteDocument(contract.id, {data: {document_id:contract.document_id}}).then(function (data) {
                _this.contract.document_id = null;
                _this.contract.document = null;
                $lcmAlert.success('Contract document has been deleted');
              });
          });
        };


        /**
         * Initiates contract section create dialog
         */
        _this.addContractSection = function () {
          $uibModal.open({
            templateUrl: 'app/contracts/section-new/section-new.html',
            controller: 'ContractSectionNewCtrl',
            backdrop: 'static',
            resolve: {
              $currentContract: function () {
                return _this.contract;
              }
            }
          }).result.then(function (data) {
            _this.sections.push(data);
            $lcmAlert.success('Contract section has been added');
          });
        };


        /**
         * Activate related items tab
         * @param tab
         */
        _this.activateRelatedTab = function (tab) {
          _this.relatedTabs = {active: tab};
        };

        _this.activateRelatedTab('documents');

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
                return _this.contract.id
              },
              entityType: function () {
                return 'contract'
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
            entity_id: _this.contract.id,
            parent_id: note.id,
            entity_type: 'contract',
            content: note.$reply.content
          }).then(function (newNote) {
            delete note.$reply;
            note.notes.push(newNote);
          });
        };

        /**
         * Queries charges against query.
         */
        _this.query = function () {
          return Contract.find($stateParams['id']).then(function (contract) {

            _this.contract = contract;

            _this.inventoriesGrid.data = _this.contract.inventories; TODO: undefined

            var sectionsQuery = {where: {contract_id: {'===': contract.id}}};
            ContractSection.findAll(sectionsQuery, {params: {contract_id: contract.id}}).then(function (sections) {
              _this.sections = sections;
              _this.sectionsGrid.data = _this.sections;

              // Get notes for the contract
              _this.notesQuery = {
                where: {
                  entity_id: {'==': contract.id},
                  entity_type: {'==': 'contract'}
                }
              };

              Note.findAll({filter: JSON.stringify(_this.notesQuery)}).then(function (notes) {
                _this.notes = notes;
              });


            });

            $lcmaPage.setTitle('Contract Doc ID: ' + _this.contract.id);

          });
        };

        _this.query();

    });
