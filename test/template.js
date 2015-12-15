/**
 *
 * escupe una template por stdout
 *
 */
var templater = require ('../templater.js');

// An example users object with formatted email function
var _templateVars = {
  domain: 'https://www.turismocity.com.ar'
};

templater.render('welcome', _templateVars)
.then(function (r) {
  console.log(r);
})
.catch(function (error) {
  console.log('error', error);
})
.done();
