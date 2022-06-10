/**
 *
 */
(function () {
  'use strict';

  function HistoryDirective(History, $uibModal, $broadcast) {

    return {
      restrict: 'E',
      templateUrl: function (elem, attrs) {
        return 'components/history/history.html';
      },
      scope: {
        model: '@'
      },
      link: function (scope, elem, attrs) {
        $broadcast.on('refresh-history', function(event) {
            History.findAll({filter: JSON.stringify(historyQuery)}, { bypassCache: true }).then(function (h) {
                scope.model = h;
            });
        });
        scope.getEntryTemplateUrl = function (entry) {
          return 'components/history/history-' + entry.unique_key + '.html';
        };


        var atr = attrs.entityType.split("@");
        if (atr.length > 1) {
          scope.entity_type = atr[0];
          var historyQuery = {
            where: {
              entity_type: {'==': atr[0]},
              entity_id: {'==': Number(atr[1])}
            }
          }

          History.findAll({filter: JSON.stringify(historyQuery)}).then(function (h) {
            scope.model = h;
          });

          scope.display = function (id) {
            $uibModal.open({
              templateUrl: 'components/history/history-compare.html',
              controller: 'HistoryShowCtrl as ctx',
              size: "md",
              backdrop: 'static',
              resolve: {
                model: function () {
                  return scope.model;
                },
                id: function () {
                  return id;
                },
                entity_type: function () {
                  return scope.entity_type;
                }
              }
            });
          };


        }
      }
    };
  }

  angular.module('lcma')
    .directive('lcmaHistory', HistoryDirective);


  angular.module('lcma')
    .controller('HistoryShowCtrl', function ($scope, $uibModalInstance, model, id, entity_type, Schema) {

      $scope.history = model.sort(function (a, b) {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      var schema = Schema.data[entity_type];
      $scope.fields = schema.fields;


      $scope.compareWith = {};

      for (var i in model) {
        if (model[i].id == id) {
          $scope.item = model[i];
          $scope.title = schema.title + " " + $scope.item.meta_data[schema.title_column];
          break;
        }
      }

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });

}());
