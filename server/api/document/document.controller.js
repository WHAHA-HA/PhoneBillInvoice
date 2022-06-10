'use strict';

var Document = require('../document/document.model');
var DocumentEntity = require('../document/document-entity.model');
var fs = require('fs');
var path = require('path');
var appRoot = process.env.PWD;
var aws = require('../../components/aws')();

exports.index = function (req, res) {
  var id = req.params.id;


  /*Document.find(id)
   .then(function (document) {
   var destination = appRoot + '/_cdn/' + document.path;
   res.sendFile(destination);

   });*/
};

exports.download = function (req, res) {
  var id = req.params.id;
  var folder = req.params.folder;
  if(req.params.subfolder){
      folder+= "/" + req.params.subfolder;
  }
  console.log('Starting to download file with id', id);
  Document.find(id)
    .then(function (document) {

      var settings = {
        folder: folder,
        key: document.path
      };
      console.log('Document found so start to download', settings);
      var buck = aws.downloadFile(settings);
      var path = document.path.replace(new RegExp(' ', 'g'), '+', 'gi');
      var file = require('fs').createWriteStream('.tmp/' + path);
      var rs = buck.createReadStream();
      rs.on('error', function (err) {
         res.status(404).end();
      });
      rs.pipe(file);

      file.on('close', function(c){
            res.setHeader("content-type", document.type);
            res.attachment(document.path);
            res.download('.tmp/' + path, path);
      });
    });
};

exports.entity = function (req, res) {
  var id = req.params.id;

  DocumentEntity.findAll({where: {entity_id: {'===': id}}}, {with: ['document']})
    .then(function (documents) {
      res.send(documents.map(function (doc) {
        return doc.document;
      }));
    }, function (err) {
      console.log('Error getting documents for entity: ', err);
      res.status(400).send(err);
    });
};


exports.create = function (req, res, next) {

  if (!req.files || !req.files.files) {
    res.end();
    return;
  }

  var files = req.files.files,
    entity = req.body.entity,
    file = files[0],
    folder = req.body.folder,
    filename = file.originalFilename;

  var settings = {
    file: file,
    folder: folder,
    key: filename
  };
  
  console.log(settings);
  
  aws.uploadFile(settings, function (err, response) {
    if (err) {
      next(err);
      return;
    }

    var param = {entity_id: null};

    if (entity) {
      param.entity_id = entity.id;
      param.parent_type = entity.parent_type;
    }

    return Document.create({
        path: filename,
        type: file.type,
        description: req.body.description
      }, param)
      .then(function (document) {

        if (entity && entity.id) {
          return DocumentEntity.create({
              document_id: document.id,
              entity_id: entity.id
            })
            .then(function () {
              return document;
            });
        }
        else {
          return document;
        }

      })
      .then(function (document) {
        res.send(document);
      })
      .catch(next);
  });
};


exports.update = function (req, res, next) {

  if (!req.files || !req.files.files) {
    res.status(404).end();
    return;
  }

  var files = req.files.files,
    entity = req.body.entity,
    document = req.body.document,
    file = files[0],
    folder = req.body.folder,
    filename = file.originalFilename;

  var settings = {
    file: file,
    folder: folder,
    key: filename
  };

  aws.uploadFile(settings, function (err, response) {
    if (err) {
      next(err);
      return;
    }


    return Document.update(document.id, {
        path: filename,
        type: file.type
      }, {entity_id: entity.id, parent_type: entity.parent_type})
      .then(function (document) {
        res.send(document);
      })
      .catch(next);
  });
};


exports.delete = function (req, res, next) {
  var id = req.params.id,
    eid = req.query.eid,
    parent_type = req.query.parent_type; //entity id

  DocumentEntity.destroyAll({where: {document_id: {'===': id}}})
    .then(function () {
      Document.find(id)
        .then(function(document) {
          return Document.destroy(id, {entity_id: eid, parent_type: parent_type, document: document});
        });
    })
    .then(function () {
      res.end();
    })
    .catch(next);
};