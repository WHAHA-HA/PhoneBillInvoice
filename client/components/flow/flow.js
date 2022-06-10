/**
 *
 */
(function () {
  'use strict';

  function FlowDirective($lcmaFlow, $lcmaDialog, $uibModal) {

    return {

      restrict: 'EA',
      scope: {
        history: '=',
        scheme: '=',
        currentStep: '=',
        onAction: '&'
      },
      templateUrl: 'components/flow/flow.html',
      link: function (scope, elem, attrs) {

        function build() {
          var flow = $lcmaFlow(scope.scheme, scope.history, scope.currentStep);
          scope.path = flow.buildPath();
        }

        scope.className = "";

        if (attrs.stepsCount) {
          scope.className += 'wiz-header-' + attrs.stepsCount + " ";
        }

        scope.executeAction = function (item, action) {

          if (item.action === false) {
            return;
          }

          if (item.previous && item.previous.key < scope.currentStep && item.allwaysTrigger !== true) {
            $lcmaDialog['confirm']({
              titleText: item.dialogTitleText || 'Invoice State Change',
              bodyText: 'Revert to ' + item.name + ' state?'
            }).result.then(function (note) {
              if (!item.to) {
                item.to = item.key;
              }
              scope.onAction({item: item, action: action, data: {note: note}});
            });
            return;
          }

          if (item.previous && item.previous.key !== scope.currentStep && item.allwaysTrigger !== true) {
            $lcmaDialog.alert({
              titleText: item.dialogTitleText || 'Invoice State Change',
              bodyText: 'Item needs to be in ' + item.previous.name + ' state before.'
            });
            return;
          }

          if (item.completePrev) {
            $lcmaDialog.alert({
              titleText: item.dialogTitleText || 'Invoice State Change',
              bodyText: 'Complete previous state.'
            });
            return;
          }

          if (item.complex) {
            if (item.complexType === 'date') {
              $lcmaDialog['date']({
                titleText: item.dialogTitleText || 'Invoice State Change'
              }).result.then(function (date) {
                if (!item.to) {
                  item.to = item.key;
                }
                scope.onAction({item: item, action: action, data: {date: date}});
              });
            }
            return;
          }


          var allowActions = true;
          if (item.triggerActionsAfter) {
            allowActions = item.triggerActionsAfter === scope.currentStep;
          }

          if (item.actions && item.actions.length && allowActions) {

            $uibModal.open({
              templateUrl: 'components/flow/flow-action.html',
              controller: 'LcmaFlowActionController',
              size: 'md',
              backdrop: 'static',
              resolve: {
                $settings: function () {
                  return {
                    item: item,
                    titleText: item.dialogTitleText || 'Invoice State Change',
                    buttonNoText: item.dialogButtonNoText || 'Cancel'
                  };
                }
              }
            }).result.then(function (response) {
              scope.onAction({
                item: item,
                action: response.action,
                data: {note: response.note, date: response.date, date2: response.date2, dropdown: response.dropdown}
              });
            });

            return;
          }

          var dialogType = action && action.confirmType ? action.confirmType : 'confirm';

          $lcmaDialog[dialogType]({
            titleText: item.dialogTitleText || 'Invoice State Change',
            bodyText: item.dialogBodyText || ('Change status to ' + item.name + '?'),
          }).result.then(function (note) {

            scope.onAction({item: item, action: action, data: {note: note}});

          });

        };

        scope.$watchCollection('history', function (x) {
          if (x) {
            build();
          }
        });

        scope.$watch('currentStep', function (x) {
          if (x || x === 0) {
            build();
          }
        });

      }

    };

  }

  function FlowProvider() {

    this.$get = function (ArrayUtil) {

      return function (schema, history, current) {

        var instance = {
          schema: schema,
          history: history,
          current: current
        };

        instance.buildPath = function () {

          var path = [],
            list = instance.schema,
            prev;

          function findProperStatus(statuses) {
            var keys = statuses.map(function (x) {

              return x.key
            });

            var historyItem = ArrayUtil.findLast(instance.history, function (x) {
              return keys.indexOf(x.status) > -1;
            });
            if (!historyItem && keys.indexOf(instance.current) > -1) {
              historyItem = statuses[keys.indexOf(instance.current)];
              historyItem.status = instance.current;
            }


            return historyItem ? statuses.find(function (x) {
              return historyItem.status === x.key;
            }) : statuses[0];
          }

          list.forEach(function (item) {

            var entry;

            if (item.statuses) {
              entry = findProperStatus(item.statuses);
              entry = entry || item.statuses[0];
            }
            else {
              entry = item
            }
            entry.isCurrent = instance.isCurrent(entry.key);
            entry.isPrev = entry.key < instance.current;
            if (prev && prev.key && entry.noPrev) {
              entry.completePrev = (prev.key === entry.noPrev);
            }
            if (entry && entry.reasonAfter != null) {
              entry.input = (entry.reasonAfter <= instance.current);
              entry.noNote = !entry.input;
            }
            entry.isNext = (entry.key > instance.current)
            entry.previous = prev;
            prev = entry;
            path.push(entry);

          });

          return path;

        };

        instance.getStep = function (step) {

          var list = instance.schema;
          for (var i = 0; i < list.length; i++) {
            if (list[i].key === step) {
              return list[i];
            }

            if (list[i].statuses) {
              for (var k = 0; k < list[i].statuses.length; k++) {
                if (list[i].statuses[k].key === step) {
                  return list[i].statuses[k];
                }
              }
            }

          }
        };

        instance.isCurrent = function (key) {
          return instance.current == key;
        };

        return instance;


      }

    }

  }

  function FlowActionController($scope, $settings, $uibModalInstance, $lcmAlert) {
    $scope.$settings = $settings;

    $scope.data = {
      note: ''
    };

    if ($scope.$settings.item.dropdown) {
      $scope.data.dropdownValue = $scope.$settings.item.dropdownValues.filter(function (x) {
        return x.value === "Other";
      })[0];
    }

    if ($scope.$settings.item.input && $scope.$settings.item.actions.length === 1) {
      $scope.selectedAction = $scope.$settings.item.actions[0];
    }

    $scope.selectAction = function (item, action, form) {

      if (action.requireReason === true) {
        $scope.selectedAction = action;

      }
      else {
        $scope.executeAction(item, action, form);
      }
    };

    $scope.executeAction = function (item, action, form) {
        if (!form.$valid) {
                return;
            }
        if (item.noNote !== true) {
            if((item.dropdown && $scope.data.dropdownValue.id===item.dropdownDefaultKey) || !item.dropdown){ //for order header status
                if(!item.notRequiredNote){
                    if ((action.key !== 'approve') && (!$scope.data.note.length || $scope.data.note.length === 0)) {
                        $scope.errorMsg = 'Please leave a note.';
                        return;
                    } else if ((action.key === 'reject') && ($scope.data.note.length <= 20)) {
                        $scope.errorMsg = 'Rejection requires a note of at least 20 characters.';
                        return;
                    } else if ((action.key !== 'approve') && ($scope.data.note.length <= 20)) {
                        $scope.errorMsg = 'Please leave a note with more than 20 characters.';
                        return;
                    }
                }
            }
        }
      

      $scope.errorMsg = '';

      $uibModalInstance.close({
        action: action,
        note: $scope.data.note,
        date: $scope.data.date,
        date2: $scope.data.date2,
        dropdown: $scope.data.dropdownValue
      });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  }

  angular.module('lcma')
    .directive('lcmaFlow', FlowDirective)
    .controller('LcmaFlowActionController', FlowActionController)
    .provider('$lcmaFlow', FlowProvider);

}());
