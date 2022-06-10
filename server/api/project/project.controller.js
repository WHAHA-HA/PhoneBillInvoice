var Project = require('./project.model');
var ProjectOrder = require('./project-order.model');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {

  var query = req.query.filter ? JSON.parse(req.query.filter) : {};

  Project.findAllWithPaging(query, {with: ['status', 'owner']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);

};

exports.show = function (req, res, next) {

  var id = req.params.id;

  Project.find(id, {with: ['status', 'owner', 'project_orders', 'project_orders.order', 'project_orders.status', 'project_orders.svc_item_type']})
    .then(function (project) {
      res.send(project);
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body;

  // TODO: Add validation

  Project.create(input, {with: ['status', 'owner']})
    .then(function (project) {
      res.send(project);
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id;

  // TODO: Add validation

  Project.find(id)
    .then(function (project) {

      project = extend(project, input);

      /**
       * Extend doesn't work well
       * @type {Document.ProjectForm.start_date|*}
       */
      project.start_date = input.start_date;
      project.end_date = input.end_date;

      return Project.update(id, project, {with: ['status', 'owner']});
    })
    .then(function (project) {
      res.send(project);
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;

  Project.destroy(id)
    .then(function () {
      res.sendStatus(200);
    })
    .catch(next);

};

// orders section

//Get Action: orders

exports.orders = function (req, res) {
  var id = req.params.id;

  ProjectOrder.findAll({where: {project_id: {'===': id}}}, {with: ['order']})
    .then(function (orders) {
      console.log('Found orders for project: ', orders);
      res.send(orders.map(function (doc) {
        return doc.order;
      }));
    }, function (err) {
      console.log('Error getting orders for project: ', err);
      res.status(400).send(err);
    });
};

// add entry to project_orders table
exports.createOrderInfo = function (req, res, next) {
  var orderInfo = req.body,
    project_id = req.params.id;

  orderInfo.project_id = project_id;

  ProjectOrder.create(orderInfo, {with: ['status', 'svc_item_type']})
    .then(function (projectOrder) {
      res.send(projectOrder);
    })
    .catch(next);
};

//delete entry from project_orders table
exports.deleteOrder = function (req, res, next) {

  var site = req.body,
    id= req.params.projectOrderId;

  ProjectOrder.destroy(id)
    .then(function() {
      res.sendStatus(200);
    })
    .catch(next);

};
