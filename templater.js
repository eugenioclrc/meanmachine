var Q = require('q');
var path = require('path');
var EmailTemplate = require('email-templates').EmailTemplate;

var templatesDir = path.resolve(__dirname, 'templates');

var _templates = {};

var getTemplate = function (name) {
  if (_templates[name]) {
    return _templates[name];
  }
  _templates[name] = new EmailTemplate(path.join(templatesDir, name));

  return _templates[name];
};

var render = function (name, vars) {
  var tpl = getTemplate(name);

  //return Q.nfcall(tpl.render, vars);
  //return Q.ninvoke(tpl,tpl.render, vars);
  var _render = Q.nbind(tpl.render, tpl);
  return _render(vars);

};

module.exports = {
  getTemplate: getTemplate,
  render: render
};
