var PORT = 11221;
var HOST = '0.0.0.0';
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
const mqtt = require('cmmc-mqtt').mqtt
var parser = require('./parser.js')
var cmmc = require('mqtt').connect('mqtt://mqtt.cmmc.io')
var parser = require("./parser")

var odin  = require('mqtt').connect('mqtt://cmmc:cmmc@odin.cmmc.io') 
odin.on('connect', function() { console.log('odin connected'); })
cmmc.on('connect', function () { console.log('cmmc connected') }) 
cmmc.on('packetsend', function(packet) { /*console.log(packet);*/ });

var counter = 0;
setInterval(function() { /*console.log('counter = ', counter, ' m/s') counter = 0;*/ }, 1000);

server.on('listening', function () {
  var address = server.address();
  console.log(new Date() + ' - UDP Server listening on ' + address.address + ":" + address.port);
  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);
});

server.on('close', function() {
  console.log('udp socket closed..'); 
});

server.on('message', function (message, remote) { 
  counter++;
  console.log('Received %d bytes from %s:%d\n', message.length, remote.address, remote.port); 
  console.log('data comming...' + new Date());
  var inByte = Buffer.from(message, 'hex');
  var out = parser.parse(inByte)
  console.log(out);

  //console.log(inByte.toString()) 
  //console.log(inByte.toString('hex')) 
  console.log('counter = ', counter)
  var data =  Object.assign({}, out, {counter: counter})
  cmmc.publish("CMMC/nb-test", JSON.stringify(data) );
  odin.publish("AIS/nb-test", JSON.stringify(data) );
});
server.bind(PORT, HOST); 
