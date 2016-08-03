
var Promise = require('bluebird');

//var client = require('redis').createClient(process.env.REDIS_URL);

//Lets require/import the HTTP module
var http = require('http');

seneca = require('seneca')({
  timeout: 30000,
  tag: 'base node',
  log:"base",
    transport:{
      redis:{
        timeout:1000,
         url: process.env.REDIS_URL
      }
    }
})
.use('redis-transport')
 .client({type:'redis'})
  .listen({type:'redis'})
// .use('mesh',
//   {
//      port: process.env.PORT||39999,
//         isbase: true,
//          listen: [
//     { type:'redis',  port: 6379} 
//   ]
//   })
console.log("redis url: "+  process.env.REDIS_URL);
seneca.pact = Promise.promisify(seneca.act, { context: seneca });

// set interval for every 9 sec send the watchdog signal
setInterval(function(){
seneca.pact({ role: 'system', cmd: 'watchdog' })
    .then(function (live) {
        console.log("Live Nodes: "+ JSON.stringify( live));
    });
}, 9000);


  seneca.add({role: 'Dummy2', cmd: 'hello'}, function (args, callback) {
            return callback(null, {msg: 'Hello, this is Dummy2'});
        });

var PORT = process.env.PORT||39999;

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: ", PORT);
});
module.exports = seneca;
