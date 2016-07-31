
var Promise = require('bluebird');



seneca = require('seneca')({
  timeout: 30000,
  tag: 'base node',
}).use('mesh',
  {
     port: process.env.PORT||39999,
        isbase: true,
  });

seneca.pact = Promise.promisify(seneca.act, { context: seneca });

// set interval for every 9 sec send the watchdog signal
setInterval(function(){
seneca.pact({ role: 'system', cmd: 'watchdog' })
    .then(function (live) {
        console.log("Live Nodes: "+ JSON.stringify( live));
    });
}, 9000);

console.log("port: "+process.env.PORT||39999)
module.exports = seneca;
