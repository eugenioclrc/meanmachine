var Q = require('q');
var templater = require ('../templater.js');

var ses = require('node-ses');

var credentials = require('../credentials.js');

var sesClient = ses.createClient({
  key: credentials.ses.access,
  secret: credentials.ses.secret
});

var sendMail = function(mailVars, tpl, callback) {
  sesClient.sendEmail({
    to: mailVars.to,
    from: mailVars.from,
    subject: mailVars.subject,
    message: tpl.html,
    altText: tpl.text
  }, callback);
};


var mailVars = {
  to: 'eugenioclrc@gmail.com',
  from: 'info@turismocity.com',
  subject: 'greetings',
};

var _template = 'welcome';
var _templatevars = {
  domain: 'https://www.turismocity.com.ar'
};

templater.render(_template, _templatevars)
.then(function(tpl){
  return Q.nfcall(sendMail, mailVars, tpl);
})
.catch(function (error) {
  console.log('error', error);
});



/*
var sendMail = function(tpl) {
  /*if(err){
    console.log('error in template');
    console.error(err)
    return;
  }* /



  sesClient.sendEmail({
    to: 'eugenioclrc@gmail.com',
    from: 'info@turismocity.com',
    subject: 'greetings',
    message: tpl.html,
    altText: tpl.text
  }, function (err, data, res) {
    if(err){
      console.log('error sending mail');
      console.error(err);
      console.log(data);
      return;
    }

    console.log('mail enviado');
    console.log(data);


  });
};

templater.render('welcome', _templateVars)
.then(sendMail)
.catch(function (error) {
  console.log('error', error);
})
.done();
*/
