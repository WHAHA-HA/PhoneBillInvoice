var pg = require('pg');
var config = require('../../config/environment');
var JSData = require('js-data');
var DSSqlAdapter = require('js-data-sql');


var store, adapter;
module.exports = function () {

  if (!store) {
    console.log('DB DATA', config.postgree_main);

    store = new JSData.DS({
      idAttribute: 'id',
      findAllWithPaging: function (query, config) {
        query = query || {where: {}};
        query.where = query.where || {};

        var _this = this,
          total = 0;

        // TODO: Convert this to retrieve count only
        return _this.findAll({where: query.where}, config)
          .then(function (result) {
            total = result.length;
            return result;
          })
          .then(function () {
            return _this.findAll(query, config);
          })
          .then(function (result) {
            return {items: result, total: total};
          });
      }
    });

    adapter = new DSSqlAdapter({
      client: 'pg',
      connection: config.postgree_main,
      queryOperators: {
        'likei': function (query, field, value) {
          return query.where(field, 'ilike', value)
        },
        '|likei': function (query, field, value) {
            return query.orWhere(field, 'ilike', value)
        }
      }
    });

    store.registerAdapter('sql', adapter, {default: true});

  }

  return {
    store: store,
    adapter: adapter
  };

};
