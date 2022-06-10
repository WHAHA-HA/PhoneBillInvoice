var db = require('../../components/db')();
var validator = require('../../components/validator');

var themeScheme = {
  id: {
    numericality: true
  },
  css: {
    presence: true
  },
  name: {
    presence: true
  },
  code: {
    presence: true
  }
};

module.exports = db.store.defineResource({
  name: 'theme',
  table: 'common_theme'
});
