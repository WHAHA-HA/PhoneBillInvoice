var OrderService = require('./order-service.model');
var extend = require('cloneextend').extend;
var Token = require('../../components/token');
var User = require('../user/user.model');
var Promise = require('es6-promise').Promise;

exports.index = function (req, res, next) {

    var query = req.query.filter ? JSON.parse(req.query.filter) : {};
    query.where.active = true;
    OrderService.findAllWithPaging(query, {with : ['user']})
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.show = function (req, res, next) {

    var id = req.params.id;

    OrderService.find(id, {with : ['user']})
            .then(function (orderService) {
                res.send(orderService);
            })
            .catch(next);
};


exports.create = function (req, res, next) {

    var input = req.body;

    // TODO: Add validation
    OrderService.findAll({
        order_id: input.order_id

    }).then(function (result) {
        var arr = result.map(function (o) {

            if (o.service_id) {
                return o.service_id;
            } else {
                return 0;
            }
        });
        var id = Math.max.apply(null, arr) + 1;
        if (arr.length === 0) {
            id = 1;
        }
        if (input.des_due_date) {
            if (!input.des_due_date_history) {
                input.des_due_date_history = [];
            }
            input.des_due_date_history.push({
                date: input.des_due_date,
                changed_at: new Date()
            });
        }
        input.service_id = id;
        OrderService.create(input, {with : ['inventory', 'inventory.type', 'inventory.features', 'inventory.plans', 'inventory.routes', 'inventory.topology', 'inventory.inventory_sites',
            'inventory.inventory_sites.site', 'inventory.inventory_sites.site.vendor', 'inventory.inventory_sites.site.building', 'inventory.inventory_sites.type', 'user']})
            .then(function (orderService) {
                res.send(orderService);

            })
            .catch(next);
    });


};

exports.update = function (req, res, next) {


    var token = Token.get(req);
    var input = req.body,
            id = req.params.id;

    // TODO: Add validation
    User.find(token.iss).then(function (user) {
        var userDesc = user.first_name + " " + user.last_name;
        OrderService.find(id)
                .then(function (orderService) {
                    orderService = extend(orderService, input);
                    if (input.foc_date && input.foc_rec_date) {
                        orderService.foc_rec_date = input.foc_rec_date;
                        orderService.foc_date = input.foc_date;
                        if (!orderService.foc_date_history) {
                            orderService.foc_date_history = [];
                        }
                        orderService.foc_date_history.push({
                            foc_date: input.foc_date,
                            foc_rec_date: input.foc_rec_date,
                            reason: input.reason,
                            note: input.note,
                            changed_at: new Date(),
                            changed_by: userDesc
                        });
                        delete orderService.note;
                        delete orderService.reason;
                    }
                   
                    if (input.accept_date) {
                        orderService.accept_date = input.accept_date;
                        if (!orderService.accept_date_history) {
                            orderService.accept_date_history = [];
                        }
                        orderService.accept_date_history.push({
                            date: input.accept_date,
                            pass: input.test_passed,
                            changed_at: new Date(),
                            note: input.note,
                            changed_by: userDesc
                        });
                        delete orderService.test_passed;
                        delete orderService.note;
                    }  
                     

                    return OrderService.update(id, orderService, {with : ['inventory', 'inventory.type', 'inventory.topology', 'inventory.features', 'inventory.plans', 'inventory.routes',
                        'inventory.inventory_sites', 'inventory.inventory_sites.site', 'inventory.inventory_sites.site.vendor', 'inventory.inventory_sites.site.building', 'inventory.inventory_sites.type', 'user']});
                })
                .then(function (orderService) {
                    res.send(orderService);
                })
                .catch(next);
    });

};

exports.delete = function (req, res, next) {

    var id = req.params.id;

    OrderService.find(id)
            .then(function (service) {
                service.active = false;
                OrderService.update(id, service, {with : ['inventory', 'inventory.type']}).then(function () {
                    res.sendStatus(200);
                });
            })
            .catch(next);

};
