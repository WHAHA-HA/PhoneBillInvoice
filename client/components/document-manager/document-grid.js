/**
 *
 */
(function () {
    'use strict';

    function DocumentGridDirective($lcmaGrid, Document, $uibModal, $lcmaDialog, $lcmAlert) {

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                entity: '=entity'
            },
            templateUrl: 'components/document-manager/document-grid.html',
            link: function (scope, elem, attrs) {

                scope.documentsGrid = $lcmaGrid({
                    enableRowSelection: true,
                    enableRowHeaderSelection: true,
                    enableSelectAll: false,
                    multiSelect: false,
                    enableSorting: false,
                    enableFiltering: false,
                    onRegisterApi: function (api) {

                        scope.documentGridApi = api;
                    }
                })
                        .addColumn('path', 'Document Name', {
                            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.readDocument(row.entity)">{{row.entity.path}}</a></div>',
                            width: '*'
                        })
                        .addColumn('type', 'Type')
                        .addColumn('description', 'Description', {
                            width: 350
                        })
                        .options();

                scope.addDocument = function () {
                    $uibModal.open({
                        templateUrl: 'components/document-manager/document-manager.html',
                        controller: 'EntityDocumentManagerCtrl',
                        backdrop: 'static',
                        resolve: {
                            $entity: function () {
                                return _.assign(_.clone(scope.entity), {parent_type: attrs.parent});
                            },
                            $settings: function () {
                                return {};
                            },
                            $document: function () {
                                return null;
                            },
                            $folder: function () {
                                return attrs.folder + "/" + scope.entity.id;
                            }
                        }
                    }).result.then(function (data) {
                        scope.documentsGrid.data.push(data);
                        $lcmAlert.success('Document has been added');
                    });
                };

                scope.removeEntityDocument = function () {
                    if (scope.documentGridApi.selection.getSelectedRows().length === 0)
                        return;
                    var documents = scope.documentGridApi.selection.getSelectedRows()[0];
                    $lcmaDialog.remove({
                        message: ' Document ' + documents.path
                    }).result.then(function () {
                        Document.destroy(documents.id, {params: {eid: scope.entity, parent_type: attrs.parent}}).then(function () {
                            Document.entity(scope.entity.id).then(function (response) {
                                scope.documentsGrid.data = response.data;
                            });
                        });
                    });
                };

                Document.entity(scope.entity.id).then(function (response) {
                    scope.documentsGrid.data = response.data;
                });

                scope.readDocument = function (doc, open) {
                    Document.getAdapter('http').GET('/api/document/' + doc.id + '/download/' + attrs.folder + "/" + scope.entity.id, {
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
                                $lcmAlert.error('Contract document is not available.');
                            });
                };

            }
        };

    }

    angular.module('lcma')
            .directive('lcmaDocumentGrid', DocumentGridDirective);


}());
