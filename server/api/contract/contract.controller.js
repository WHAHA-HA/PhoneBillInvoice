'use strict';

var Contract = require('../contract/contract.model');
var Document = require('../document/document.model');
var ContractSection = require('../contract/contract-section.model');
var fs = require('fs');
var path = require('path');
var appRoot = process.env.PWD;
var aws = require('../../components/aws')();

exports.index = function (req, res, next) {

/*  var query = {
    where: {

    }
  };*/
  var query = req.query && req.query.filter ? JSON.parse(req.query.filter) : {};

  Contract.findAllWithPaging(query, {with: ['vendor', 'children', 'children.children','children.vendor','children.children.vendor', 'document', 'inventories', 'inventories.type', 'inventories.site']})
    .then(function (result) {
      res.send(result);
    })
    .catch(next);
};

exports.show = function (req, res, next) {
  Contract.find(req.params.id, {with: ['vendor', 'document', 'inventories', 'inventories.type', 'inventories.site', 'inventories.vendor']})
    .then(function (contract) {
      res.send(contract);
    })
    .catch(next);
};


exports.create = function (req, res, next) {

  var input = req.body;
  console.log('Contract input:', input);
  Contract.create(input, {with: ['vendor']})
    .then(function (contract) {
      res.send(contract);
    })
    .catch(next);

};

exports.update = function (req, res, next) {

  var input = req.body,
    id = req.params.id;

  Contract.update(id, input, {with: ['vendor']})
    .then(function (contract) {
      // Log history
     // Contract.createHistoryEntry(contract, 'update', {});
      res.send(contract);
    })
    .catch(next);

};


exports.delete = function (req, res, next) {

  var id = req.params.sid;

  Contract.destroy(id)
    .then(function () {
      res.status(200).end();
    })
    .catch(next);

};


exports.getSections = function (req, res, next) {

  var contract_id = req.params.id,
    query = {where: {contract_id: {'===': contract_id}}};

  console.log('QUERY', query);

  ContractSection.findAll(query, {with: ['contract']})
    .then(function (sections) {
      res.status(200).send(sections);
    })
    .catch(next);

};


exports.createSection = function (req, res, next) {

  var section = req.body,
    contract_id = req.params.id;

  section.contract_id = contract_id;

  ContractSection.create(section, {with: ['contract']})
    .then(function (section) {
      res.send(section);
    })
    .catch(next);

};


exports.updateSection = function (req, res, next) {

  var input = req.body,
    id = req.params.sid;

  ContractSection.update(id, input, {with: ['contract']})
    .then(function (section) {
      res.send(section);
    })
    .catch(next);

};


exports.deleteSection = function (req, res, next) {

  var input = req.body,
    id = req.params.sid;

  ContractSection.find(id, {with: ['contract']})
    .then(function (section) {

      ContractSection.destroy(id, {contract_id: req.params.id, section: section})
        .then(function () {
          res.status(200).end();
        })
        .catch(next);

  }, function (err) {
    console.log('Error finding contract section:', id);
    res.status(404).send(err);
  });



};

exports.setDocument = function (req, res, next) {
  var id = req.params.id;
  console.log(req.files);

  if (!req.files || !req.files.files) {
    res.status(400).end();
    return;
  }

  var files = req.files.files,
    file = files[0],
    filename = file.originalFilename,
    destination = appRoot + '/_cdn/' + filename;


  var settings = {
    file: file,
    folder: 'contracts',
    key: filename
  };


  aws.uploadFile(settings, function (err, response) {

    if (err) {
      next(err);
      return;
    }

    return Document.create({
        path: filename,
        type: file.type
      }, {with: 5, entity_id: id , parent_type: 'contract'})
    .then(function (document) {

      return Contract.find(id, {with: ['vendor', 'document']}).then(function (contract) {
        console.log('Found contract:', contract);

        contract.document_id = document.id;
        return contract;
      }, function (err) {
        console.log('Error finding contract:', id);
        res.status(404).send(err);
      });
    }, function (err) {
      console.log('Error creating document:', err);
    })
    .then(function (contract) {
      console.log('Updaing contract:', contract);
      return Contract.update(contract.id, contract, {with: ['vendor', 'document']});
    }, function (err) {
      console.log('Error updating contract:', id);
      res.status(400).send(err);
    })
    .then(function (contract) {

      // Log history
      //Contract.createHistoryEntry(contract, 'document:create', {});

      res.send(contract);
    })
    .catch(next);
  });
};

exports.deleteDocument = function (req, res, next) {
    var id = req.params.id;
    var documentId = req.body.document_id;
    Contract.find(id).then(function(contract){
      contract.document_id = null;
      Contract.update(id, contract, {with: ['vendor']})
        .then(function (contract) {

          Document.find(documentId)
            .then(function(document) {
              Document.destroy(documentId, {entity_id: id, parent_type: 'contract', document: document})
                .then(function () {
                  res.send(contract);
                }).catch(next);
            })


        }).catch(next);
    });
};
