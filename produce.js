/**
 * Inserta mails y datos en las colas
 */

var fs = require('fs');
var _async = require('async');
var sqs = require('sqs');

var credentials = require('./credentials.js');

var queue = sqs({
    access: credentials.sqs.access,
    secret: credentials.sqs.secret,
    region: credentials.sqs.region
});

for(var i=0; i<10; i+=1){
  // push some data to the test queue
  queue.push('meanmachine', {
    from: 'info@yourcomanymail.com',
    to: 'testyourmail@gmail.com',
    template: 'welcome',
    subject: 'testing',
    templatevars: {}
  }, function () {
      console.log('ready');
  });
}
