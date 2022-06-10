var Dictionary = require('./dictionary.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

    var group = req.params.group,
            query = {
                where: {
                    group: {'===': group}
                }
            };

    Dictionary.findAll(query)
            .then(function (result) {
                result.sort(function(a,b){
                    return a.order_number>b.order_number;
                });
                res.send(result);
            })
            .catch(next);

};

exports.groups = function (req, res, next) {
    Dictionary.findAll()
            .then(function (result) {
                var t = result.map(function (o) {
                    return o.group;
                });
                t = t.filter(function (o, i) {
                    return t.indexOf(o) === i;
                });
                res.send(t);
            })
            .catch(next);
};

exports.all = function (req, res, next) {
    var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};
    Dictionary.findAllWithPaging(query)
            .then(function (result) {
                res.send(result);
            })
            .catch(next);

};

exports.show = function (req, res, next) {

    var id = req.params.id;

    Dictionary.find(id)
            .then(function (site) {
                res.send(site);
            })
            .catch(next);
};


exports.create = function (req, res, next) {
    var input = req.body;

    // TODO: Add validation
    Dictionary.create(input)
            .then(function (site) {
                res.send(site);
            })
            .catch(next);

};

exports.update = function (req, res, next) {
    var input = req.body,
            id = req.params.id;

    // TODO: Add validation
    Dictionary.update(id, input)
            .then(function (dictionary) {
                res.send(dictionary);
            })
            .catch(next);

};

exports.delete = function (req, res, next) {

    var id = req.params.id;

    Dictionary.delete(id)
            .then(function () {
                res.sendStatus(200);
            })
            .catch(next);

};
