var ContentFilter = require('../../components/content-filter');
var ModuleRegistry = require('../../components/module');
var extend = require('cloneextend').cloneextend;

exports.index = function (req, res, next) {
    
  var query = req.query.filter ? JSON.parse(req.query.filter) : {},         
    modules = ModuleRegistry.all();
    if(req.query.where){
        query = JSON.parse(req.query.where);
    }
  ContentFilter.findAll(query, {with: ['role']})
    .then(function (result) {

      var list = [];

      result.forEach(function (filter) {
        filter.module = findModule(modules, filter.module_id);

        list.push(createFilter(filter));
      });

      res.send(list);
    })
    .catch(next);

};

exports.show = function (req, res, next) {

  var id = req.params.id,
    modules = ModuleRegistry.all();

  ContentFilter.find(id, {with: ['role']})
    .then(function (filter) {
      filter.module = findModule(modules, filter.module_id);
      res.send(createFilter(filter));
    })
    .catch(next);
};


exports.create = function (req, res, next) {
  var input = req.body,
  modules = ModuleRegistry.all();

  // TODO: Add validation


  ContentFilter.create(input, {with: ['role']})
    .then(function (filter) {
      filter.module = findModule(modules, filter.module_id);
      res.send(createFilter(filter));
    })
    .catch(next);

};

exports.update = function (req, res, next) {
  var input = req.body,
    id = req.params.id,
    modules = ModuleRegistry.all();
  // TODO: Add validation

  ContentFilter.find(id)
    .then(function (contentFilter) {
      contentFilter = extend(contentFilter, input);
      return ContentFilter.update(id, contentFilter, {with: ['role']});
    })
    .then(function (filter) {
      filter.module = findModule(modules, filter.module_id);
      res.send(createFilter(filter));
    })
    .catch(next);
};

exports.delete = function (req, res, next) {

  var id = req.params.id;
  ContentFilter.find(id)
    .then(function(contentFilter) {

      ContentFilter.destroy(id, {content_filter: contentFilter})
        .then(function () {
          res.sendStatus(200);
        })
        .catch(next);

    });

};

function findModule(list, key) {
  for (var i=0;i<list.length;i++) {
    if(list[i].key === key) {
      return list[i]
    }
  }
}

function createFilter(filter) {

  var val;

  try {
    val = JSON.parse(filter.value);
  }
  catch(e) {
    val = filter.value;
  }

  return {
    id: filter.id,
    module: filter.module,
    title: filter.title,
    type: filter.type,
    property_name: filter.property_name,
    property: filter.module.findProperty(filter.property_name),
    operator: filter.operator,
    value:  val
  }
}
