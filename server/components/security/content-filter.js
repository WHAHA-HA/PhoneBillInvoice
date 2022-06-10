var PermissionFilter = require('../content-filter');
var User = require('../user');
var Token = require('../token');

exports.apply = function (req, permissions) {
  var filterQuery = {},
    permission = permissions[0];



  if(permission) {

    var filters = permission.permission_filters
      .filter(function (x) {
        return !!x.filter;
      })
      .map(function (x) {
      return x.filter;
    });

    console.log('FILTERS:', filters);

    filters.forEach(function (filter) {

      var value = JSON.parse(filter.value),
        operator = filter.operator,
        type = filter.type;

      var prop = filterQuery[filter.property_name] = {};

      console.log('Applying operator:', filter);
      console.log('Operator type:', type);

      // TODO: Not all cases and operators covered
      if (type === 'date') {
        if (operator == '<') {
          prop['<'] = $lcmaDate(value.from).format('YYYY-MM-DD');
        }
        else if (operator == '<>') {
          prop['>'] = $lcmaDate(value.from).format('YYYY-MM-DD');
          prop['<'] = $lcmaDate(value.to).format('YYYY-MM-DD');
        }
        else if (operator == '>') {
          prop['>'] = $lcmaDate(value.from).format('YYYY-MM-DD');
        }
      }
      else if(type == 'number') {


        if (operator == '<') {
          prop['<'] = parseFloat(value);
        }
        else if (operator == '<>') {
          prop['>'] = parseFloat(value.from);
          prop['<'] = parseFloat(value.to);
        }
        else if (operator == '>') {
          prop['>'] = parseFloat(value);
        }

        console.log('PROP', prop);

      }
      else {
        prop[operator] = value;
      }
    });

    req.filterQuery = filterQuery;
  }
};
