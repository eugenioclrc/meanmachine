/* esnext: true */
/**
 * Lee datos de las colas y manda los mails
 */

var fs = require('fs');
var _async = require('async');
var sqs = require('sqs');
var ses = require('node-ses');
var templater = require ('./templater.js');
var Q = require('q');

var credentials = require('./credentials.js');

var queue = sqs({
    access: credentials.sqs.access,
    secret: credentials.sqs.secret,
    region: credentials.sqs.region
});

var sesClient = ses.createClient({
  key: credentials.sqs.access,
  secret: credentials.sqs.secret
});

var WORKERS = 10; // cantidad de WORKERS paralelos

var sendMail = function(mailVars, tpl, callback) {
  sesClient.sendEmail({
    to: mailVars.to,
    from: mailVars.from,
    subject: mailVars.subject,
    message: tpl.html,
    altText: tpl.text
  }, callback);
};

var _queueConsume = function (data, callback) {
  var mailVars = {
    from: data.from,
    to: data.to,
    subject: data.subject
  };

  templater.render(data.template, data.templatevars)
  .then(function(tpl){
    return Q.nfcall(sendMail, mailVars, tpl);
  })
  .then(callback)
  .catch(function (error) {
    console.log('error', error);
    process.exit();
  });
};

var q = _async.queue(_queueConsume, WORKERS);

var _messagePullCallback = function(message, callback) {
  // @TODO ver si validamos el mensaje usando jsonschema

  q.push(message, function (err) {
    console.log('finished processing #' + message.to);
    // el callback elimina el queue
    callback(); // we are done with this message - pull a new one
    // calling the callback will also delete the message from the queue
  });
};

// pull messages from the test queue
queue.pull('meanmachine', _messagePullCallback, WORKERS);
