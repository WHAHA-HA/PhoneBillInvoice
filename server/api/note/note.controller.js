/**
 *
 */

'use strict';

var Note = require('../note/note.model');
var NoteCharge = require('../note/note-charge.model');
var Token = require('../../components/token');
//var ce = require('cloneextend');

/**
 * GET  /notes ->  index
 */
exports.index = function (req, res, next) {
  var query = JSON.parse(req.query.filter);

  query.where.parent_id = {'==': null};

  Note.findAll(query, {with: ['user', 'note', 'note.user', 'note_charge', 'note_charge.charge']})
    .then(function (notes) {
      res.send(notes);
    })
    .catch(next);

};


exports.create = function (req, res, next) {

  var input = req.body,
    charges = input.charges;
  var token = Token.get(req);
  input.created_at = new Date();
  input.user_id = token.iss;


  Note.create({
      user_id: input.user_id,
      created_at: new Date(),
      parent_id: input.parent_id,
      entity_id: input.entity_id,
      entity_type: input.entity_type,
      content: input.content
    }, {with: ['user', 'note_charge', 'note_charge.charge']})
    .then(function (note) {

      // TODO: We need to do this in bg and send single promise (q.all)
      if (charges && charges.length) {
        charges.forEach(function (charge) {

          NoteCharge.create({
            note_id: note.id,
            charge_id: charge.id
          })
              .then(function(notecharge){

              })
              .catch(next);

            note.charges.push(charge);
        });
      }
      res.send(note);
    }).catch(next);

};
