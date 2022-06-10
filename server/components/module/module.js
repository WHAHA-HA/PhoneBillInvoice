var security = require('../security');

function AppModule(key, title, actions, properties) {
  this.key = key;
  this.title = title;
  this.actions = actions || [];
  this.properties = properties || [];
}

AppModule.prototype.addAction = function (action) {
  var actions = this.actions;
  if (actions.indexOf(action) == -1) {
    actions.push(action);
  }
  return this;
};

AppModule.prototype.removeAction = function (action) {
  var actions = this.actions;

  actions.splice(actions.indexOf(action), 1);
};

AppModule.prototype.secure = function (actions) {
  return security(this.key, actions);

};

AppModule.prototype.findProperty = function (name) {
  this.properties = this.properties || [];
  var result =  this.properties.filter(function (prop) {
    return prop.name === name;
  });

  return result.length ? result[0] : null;
};


module.exports = AppModule;
