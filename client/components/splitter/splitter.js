/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaLayout', function ($compile, UserSettingsService) {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
          orientation: '@',
          onChange: '&'
        },
        template: '<div class="split-panes {{orientation}}" ng-transclude></div>',
        controller: ['$scope', function ($scope) {
          $scope.panes = [];

          this.addPane = function (pane) {
            if ($scope.panes.length > 1)
              throw 'splitters can only have two panes';
            $scope.panes.push(pane);
            return $scope.panes.length;
          };

          this.sizeChanged = function (pane) {
            // What to do with it
          };
        }],
        link: function (scope, element, attrs) {
          var handlerHtml =
            '<div class="split-handler">' +
            '<div class="commands">' +
            '<i class="down fa fa-arrow-down" ng-click="command(\'down\')"></i>' +
            '<i class="up fa fa-square-o" ng-click="command(\'center\')"></i>' +
            '<i class="up fa fa-arrow-up" ng-click="command(\'up\')"></i>' +
            '</div>' +
            '</div>';

          var handler = angular.element($compile(handlerHtml)(scope)),
            commands = angular.element(handler.children());

          var pane1 = scope.panes[0];
          var pane2 = scope.panes[1];
          var pane1Min = pane1.minSize || 20;
          var pane2Min = pane2.minSize || 20;
          var settingsKey = attrs.settingsKey;
          var isVertical = scope.orientation == 'vertical';
          var drag = false;
          var settingsReady = false;
          var bounds = element[0].getBoundingClientRect();

          pane1.elem.after(handler);

          scope.settings = UserSettingsService.createInstance(settingsKey);

          if (settingsKey) {
            UserSettingsService.load(settingsKey)
              .then(function (settings) {
                if (settings && settings.value) {
                  scope.settings = settings;
                  scope.orientation = settings.value.orientation;
                  pane1.size = settings.value.pane1;
                  pane2.size = settings.value.pane2;
                  var ev = calculatePosition(scope.panes);
                  redraw(ev);
                }
                settingsReady = true;

                return settings;
              });
          }
          else {
            settingsReady = true;
          }


          function saveSettings() {
            scope.settings.value = scope.settings.value || {};
            scope.settings.value.pane1 = pane1.size;
            scope.settings.value.pane2 = pane2.size;
            scope.settings.value.orientation = scope.orientation;

            if (scope.settings.key) {
              UserSettingsService.save(scope.settings)
                .then(function (data) {
                  angular.merge(scope.settings, data);
                });
            }

            scope.onChange({
              settings: {
                pane1: pane1.size,
                pane2: pane2.size,
                orientation: scope.orientation
              }
            });
          }

          function calculatePosition(panes) {

            var p1 = panes[0],
              p2 = panes[1];

            if (p1.size > 100) {
              p1.size = 50;
            }

            if (p2.size > 100) {
              p2.size = 50;
            }

            if (!p1.size && !p2.size) {
              p1.size = 50;
              p2.size = 50;
            }
            else if (!p1.size) {
              p1.size = 100 - p2.size;
            }
            else if (!p2.size) {
              p2.size = 100 - p1.size;
            }

            var width = bounds.right - bounds.left;
            var height = bounds.bottom - bounds.top;
            var clientX = parseInt(width / 100 * p1.size) + bounds.left;
            var clientY = parseInt(height / 100 * p1.size) + bounds.top;

            //console.log("ClientX", clientX);
            //console.log("ClientY", clientY);

            return {
              clientY: clientY,
              clientX: clientX
            };
          }

          function redraw(ev) {
            var bounds = element[0].getBoundingClientRect();
            var pos = 0;
            var vertical = scope.orientation == 'vertical';

            if (vertical) {

              var height = bounds.bottom - bounds.top;
              pos = ev.clientY - bounds.top;

              if (pos < pane1Min) {
                pos = pane1Min;
              }

              if (height - pos < pane2Min) return;

              handler.css('top', pos + 'px');
              handler.css('left', 0 + 'px');
              handler.css('right', 0 + 'px');

              pane1.elem.css('height', pos + 'px');
              pane1.elem.css('top', 0 + 'px');
              pane1.elem.css('left', 0 + 'px');
              pane1.elem.css('right', 0 + 'px');
              pane1.elem.css('width', '');


              pane2.elem.css('top', pos + 'px');
              pane2.elem.css('left', 0 + 'px');
              pane2.elem.css('right', 0 + 'px');
              pane2.elem.css('width', '');

              pane1.size = pos / height * 100;
              pane2.size = 100 - pane1.size;

            } else {

              var width = bounds.right - bounds.left;
              pos = ev.clientX - bounds.left;

              if (pos < pane1Min) {
                pos = pane1Min;
              }

              if (width - pos < pane2Min) return;

              handler.css('top', 0 + 'px');
              handler.css('bottom', 0 + 'px');
              handler.css('left', pos + 'px');

              pane1.elem.css('width', pos + 'px');
              pane1.elem.css('height', '');
              pane1.elem.css('top', 0 + 'px');

              pane2.elem.css('left', pos + 'px');
              pane2.elem.css('right', 0 + 'px');
              pane2.elem.css('top', 0 + 'px');
              pane2.elem.css('height', '');

              pane1.size = pos / width * 100;
              pane2.size = 100 - pane1.size;
            }
          }

          scope.$watchCollection('panes', function (panes) {
            if (panes.length === 2) {
              var ev = calculatePosition(panes);
              redraw(ev);
            }
          });

          attrs.$observe('orientation', function (x) {
            scope.orientation = x;
            isVertical = scope.orientation == 'vertical';
            var ev = calculatePosition(scope.panes);
            redraw(ev);
            if (settingsReady) {
              saveSettings();
            }
          });

          commands.bind('mousedown', function (ev) {
            ev.stopPropagation();
          });

          element.bind('mousemove', function (ev) {
            if (!drag) return;

            redraw(ev);
          });

          handler.bind('mousedown', function (ev) {
            ev.preventDefault();
            drag = true;
          });

          angular.element(document).bind('mouseup', function (ev) {
            ev.stopPropagation();
            if(drag) {
              saveSettings();
            }
            drag = false;


          });

          scope.command = function (command) {
            if (command === 'up') {
              redraw({
                clientY: pane1Min,
                clientX: pane1Min
              });
            }
            else if (command === 'down') {

              redraw({
                clientY: bounds.bottom - pane2Min,
                clientX: bounds.right - pane2Min
              });
            }
            else if (command === 'center') {

              redraw(calculatePosition(scope.panes));
            }
            else if (command === 'swap') {
              pane1.elem.after(pane2.elem);
            }
          };
        }
      };
    })
    .directive('lcmaLayoutPane', function () {
      return {
        restrict: 'E',
        require: '^lcmaLayout',
        replace: true,
        transclude: true,
        scope: {
          minSize: '='
        },
        template: '<div class="split-pane{{index}}" ng-transclude></div>',
        link: function (scope, element, attrs, ctrl) {
          scope.elem = element;
          scope.size = attrs.size;
          scope.minSize = parseInt(attrs.minSize || 20);
          scope.index = ctrl.addPane(scope);

          attrs.$observe('size', function (size) {
            scope.size = size;
            ctrl.sizeChanged(scope);
          });
        }
      };
    });

}());
