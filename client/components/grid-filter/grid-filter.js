/**
 */
(function () {
  'use strict';


  angular.module('lcma')
    .provider('$lcmaGridFilter', function () {

      var filter = {},
        query = {},
        grid;


      this.$get = function ($lcmaDate) {


        function findColumn(grid, columnName) {
          for (var i = 0; i < grid.columns.length; i++) {
            if (grid.columns[i]['field'] === columnName) {
              return grid.columns[i];
            }
          }
        }

        function buildFilter(type, column) {

          var val = {},
            filter = column.filters[0],
            term;

          try {
            term = JSON.parse(filter.term);
          }
          catch (e) {
            term = filter.term;
          }

          if (type === 'date') {
            if (term.operator == 'before') {
              val['<'] = $lcmaDate(term.from).format('YYYY-MM-DD');
            }
            else if (term.operator == 'between') {
              val['>'] = $lcmaDate(term.from).format('YYYY-MM-DD');
              val['<'] = $lcmaDate(term.to).format('YYYY-MM-DD');
            }
            else if (term.operator == 'after') {
              val['>'] = $lcmaDate(term.from).format('YYYY-MM-DD');
            }
          }

          else if (type === 'status') {
              if(term.length>1){
                   val[term[0].operator] = term[0].value;
                   val[term[1].operator] = term[1].value;
              }  else{
                   val[term.operator] = term.value;
              }
          }

          else if (type === 'number') {
            val[term.operator] = term.value;
          }

          else if (type === 'boolean') {
            val[term.operator] = term.value;
          }

          else if (type === 'currency') {
            val[term.operator] = term.value;
          }

          else if (type === 'enum') {
            val = {'==': filter.term};
          }
          else {

            var sufix = '%',
              prefix = '';
            var result = filter.term;

            if(filter.term.indexOf('*') > -1) {
              result = result.replace(new RegExp('\\*', 'g'), '');
              prefix = '%';
            }

            val = {'likei': prefix + result + sufix};
          }

          return val;

        }

        return function (filterGrid, filterQuery) {

          query = filterQuery;
          grid = filterGrid;

          filter.applyAll = function (defs) {

            defs = defs || [];

            if(!angular.isArray(defs)) {
              defs = [defs];
            }

            angular.forEach(defs, function (x) {
              filter.apply(x.field, x.type);
            });

          };

          filter.apply = function (name, type) {
            var column = findColumn(grid, name);

            var term = column.filters[0].term;

            if (term === null || term === undefined) {
              delete query.where[name];
            }
            else {
              query.where[name] = buildFilter(type, column);
            }

            return filter;
          };


          return filter;


        };
      };

    })

}());
