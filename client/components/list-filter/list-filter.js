/**
 *
 */
(function () {
  'use strict';

  angular.module('lcma')
    .directive('lcmaListFilter', function ($broadcast) {

      return {
        restrict: 'EA',
        template: '<a uib-popover-template="popoverOptions.templateUrl" popover-trigger="outsideClick" popover-append-to-body="true" popover-is-open="popoverOptions.isOpen" popover-placement="auto bottom" popover-title="{{popoverOptions.title}}" type="button" class="btn btn-default btn-block btn-xs">{{ displayValue }}</a>',
        scope: {
          model: '=ngModel',
          source: '=filterOptions',
          map: '=map',
          value: '=value',
          warning: '=warning',
          column: '=column',
          nulls : '=nulls'
        },
        link: function (scope, elem, attrs) {

          var filter = scope.filter = {};

          scope.displayValue = '...';

          function prependNullEntry(list) {
            if(scope.nulls){
                list.splice(0, 0, {value: null, label: '< Blank >'});
            }
          }

          function selectPredefinedValue() {
            var value = scope.value,
              options = scope.options;
            if (value && options) {
              options.forEach(function (x) {
                if(value == x.value) {
                  x.selected = true;
                }
              });

              var selected = getSelectedOptions(options);

              var values = selected.map(function (x) {
                return x.value;
              });

              setFilterText(values, selected);
            }
          }

          if (scope.source && scope.source.then) {
            scope.source.then(function (list) {
              scope.options = scope.map ? list.map(scope.map) : list;
              scope.options.sort(function(a,b){
                    return a.label.localeCompare(b.label);
              });
              selectPredefinedValue();
              prependNullEntry(scope.options);
            });
          }
          else {
            scope.options = scope.source;
            scope.options.sort(function(a,b){
                    return a.label.localeCompare(b.label);
            });
            selectPredefinedValue();
            prependNullEntry(scope.options);
          }

          scope.popoverOptions = {
            templateUrl: 'components/list-filter/list-filter.html',
            title: 'List Filter'
          };

          scope.$watch('model', function (val) {
            if (!val) {
              scope.clearFilter();
            }
          });

          scope.selectionChange = function (option) {
            if (option.selected && option.value === -1) {
              scope.options.forEach(function (x) {
                if (x.value != -1) {
                  x.selected = false;
                }
              });
            }
            else if (option.selected) {
              var neutral = scope.options.filter(function (x) {
                return x.value === -1 || (typeof x.value == 'undefined') ;
              })[0];

              if (neutral) {
                neutral.selected = false;
              }
            }
          };

        $broadcast.on('update-filter-text', function (event, args) {
            for (var i in scope.options) {
                scope.options[i].selected = false;
            }
            if (args.column === scope.column) {
                var selectedItems = args.values;
                for (var i in scope.options) {
                    for (var j in selectedItems) {
                        if (scope.options[i].value == selectedItems[j]) {
                            scope.options[i].selected = true;
                        }
                    }
                }
                scope.applyFilter();
            }
        });

          function setFilterText(values, selected) {
            var t = selected.map(function(x){
                return x.value;
            }).indexOf(null)>=0;
            var len = values.length + (t?1:0);
            if (len > 1) {
                scope.displayValue = len + ' selected';
            }

            else if (len === 1) {
                scope.displayValue = selected[0].label;
            }
            else {
              scope.displayValue = '...';
            }
          }

          function getSelectedOptions(options) {
            return options
              .filter(function (x) {
                return x.selected && x.value !== -1;
              });
          }

          scope.applyFilter = function () {

            var selected = getSelectedOptions(scope.options);

            var values = selected.map(function (x) {
              return x.value;
            });

            if (values) {
                var res = {};
                var t = values.indexOf(null);
                if(t>=0){
                    var i = values.length;
                    values.splice(t,1);
                    if(i>1){
                        res = [{operator: 'in', value: values.length ? values : undefined},{operator: '|==', value: null}];
                    } else {
                         res = {operator: '==', value: null};
                    }

                } else {
                    res = {operator: 'in', value: values.length ? values : undefined};
                }

              scope.model = JSON.stringify(res);

              setFilterText(values, selected);

              scope.popoverOptions.isOpen = false;
            }
          };

          scope.clearFilter = function () {
            scope.model = undefined;
            scope.displayValue = '...';
            scope.popoverOptions.isOpen = false;
            scope.filter = {};

            // uncheck all selected option
            var selectedOptions = getSelectedOptions(scope.options);

            _.each(selectedOptions, function(option) {
              option.selected = false;
            });
          };

          scope.close = function () {
            scope.popoverOptions.isOpen = false;
          };


        }
      };

    })
}());
