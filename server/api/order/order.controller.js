var Order = require('./order.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  Order.findAllWithPaging(query, {with: ['services', "services.inventory", "dictionary","services.inventory.type", "services.inventory.topology",
    "services.inventory.inventory_sites", "services.inventory.inventory_sites.site", "services.inventory.inventory_sites.site.building", "services.inventory.inventory_sites.site.vendor",
    "services.inventory.inventory_sites.site.type", "user","services.user", "vendor",
    'services.inventory.features', 'services.inventory.plans', 'services.inventory.routes'
  ]})
    .then(function (result) {
        for(var i in result.items){
            if(result.items[i].services)
            result.items[i].services = result.items[i].services.filter(function(x){
                return x.active===true;
            });
        }
      res.send(result);
    })
    .catch(next);

};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Order.find(id, {with: ['services', 'services.type',"services.inventory", "services.inventory.type", "services.inventory.topology", "services.inventory.inventory_sites", "dictionary","services.inventory.inventory_sites.site",
    "services.inventory.inventory_sites.site.building", "services.inventory.inventory_sites.site.vendor", "services.inventory.inventory_sites.site.type", "services.inventory.routes", "services.inventory.features", "services.inventory.plans", "services.user","user", "vendor"]})
    .then(function (order) {
      // TODO: relation does not work so need to collect sites here
      order.services = order.services.filter(function(x){
          return x.active===true;
      });
      res.send(order);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;
  input.created_at = new Date();

  // TODO: Add validation

  Order.create(input, {with: ['services', 'services.type',"services.inventory","services.inventory.type", "services.inventory.topology", "services.inventory.inventory_sites", "dictionary","services.inventory.inventory_sites.site",
    "services.inventory.routes", "services.inventory.features", "services.inventory.plans", "services.user","user", "vendor"]})
    .then(function (order) {
      res.send(order);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  // TODO: Add validation

  Order.find(id)
    .then(function (order) {
      order = extend(order, input);

      /**
       * Extend doesn't work well with date
       */
        if(input.complete_date){
          order.complete_date = input.complete_date;
        }
        if(input.ack_date){
          order.ack_date = input.ack_date;
        }
        if(input.created_at){
          order.created_at = input.created_at;
        }
        if(input.approve_date){
          order.approve_date = input.approve_date;
        }
        if(input.send_date){
            order.send_date = input.send_date;
        }
        if(input.request_date){
            order.request_date = input.request_date;
        }
        if(input.ready_for_approval){
            order.ready_for_approval = input.ready_for_approval;
        }
        if(input.vendor_accept_date){
            order.vendor_accept_date = input.vendor_accept_date;
        }
        if(input.vendor_reject_date){
            order.vendor_reject_date = input.vendor_reject_date;
        }
      return Order.update(id, order, {with: ['services', "services.user","user", "vendor"]});
    })
    .then(function (order) {
      res.send(order);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Order.destroy(id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);

};
