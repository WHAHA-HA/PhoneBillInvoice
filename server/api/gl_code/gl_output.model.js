var db = require('../../components/db')();
var History = require('../history/history.model');

module.exports = db.store.defineResource({
    name: 'gloutput',
    table: 'gl_output'
});
