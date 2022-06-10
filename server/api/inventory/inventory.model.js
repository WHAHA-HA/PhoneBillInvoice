var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
  name: 'inventory',
  table: 'inventory_detail',
  afterUpdate: function (resource, data, cb) {
    History.add("inventory", "update", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  afterCreate: function (resource, data, cb) {
    History.add("inventory", "create", data.id, JSON.stringify(data));
    if (cb) {
        cb(null, data);
    }
  },
  computed: {
    sites: ['inventory_sites', function (items) {
      var sites = [];

      if(items) {
        items.forEach(function (uir) {
          sites.push(uir.site);
        });
      }
      return sites;
    }]
  },
  relations: {
    belongsTo: {
      site: [
        {
          localField: 'siteA',
          localKey: 'site_a_id'
        },{
          localField: 'siteZ',
          localKey: 'site_z_id'
        },{
          localField: 'site',
          localKey: 'site_id'
        }
      ],
      dictionary: [
          {
              localField: 'type',
              localKey: 'type_id'
          },{
              localField: 'technology',
              localKey: 'technology_id'
          }
      ],
      vendor: {
        localField: 'vendor',
        localKey: 'vendor_id'
      },
      contract: {
        localField: 'contract',
        localKey: 'contract_id'
      }
    },
    hasOne: {
      dictionary: [
        {
          localField: 'type',
          localKey: 'type_id'
        },{
          localField: 'topology',
          localKey: 'topology_id'
        }
      ],
        order_service: {
            localField: 'order_service',
            foreignKey: 'inventory_id'
        }
    },
    hasMany: {
      inventory_site: {
        localField: 'inventory_sites',
        foreignKey: 'inventory_id'
      },
      inventory_feature: {
        localField: 'features',
        foreignKey: 'inventory_id'
      },
      inventory_plan: {
        localField: 'plans',
        foreignKey: 'inventory_id'
      },
      underlying_service: {
        localField: 'services',
        foreignKey: 'inventory_id'
      },
      route: {
        localField: 'routes',
        foreignKey: 'inventory_id'
      }
    }
  }
});
