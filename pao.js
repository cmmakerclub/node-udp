var PORT = 30002
var HOST = '0.0.0.0'
var dgram = require('dgram')
var server = dgram.createSocket('udp4')
const mqtt = require('cmmc-mqtt').mqtt
var cmmc = require('mqtt').connect('mqtt://mqtt.cmmc.io')
var odin = require('mqtt').connect('mqtt://cmmc:cmmc@odin.cmmc.io')

odin.on('connect', function () { console.log('odin connected') })
cmmc.on('connect', function () { console.log('cmmc connected') })
cmmc.on('packetsend', function (packet) { /*console.log(packet);*/ })
odin.on('packetsend', function (packet) {
  /*console.log(packet);*/
  console.log('odin', packet)
})

var counter = 0
setInterval(function () { /*console.log('counter = ', counter, ' m/s') counter = 0;*/ }, 1000)

server.on('listening', function () {
  var address = server.address()
  console.log(new Date() + ' - UDP Server listening on ' + address.address + ':' + address.port)
  var port = address.port
  var family = address.family
  var ipaddr = address.address
  console.log('Server is listening at port' + port)
  console.log('Server ip :' + ipaddr)
  console.log('Server is IP4/IP6 : ' + family)
})

server.on('close', function () {
  console.log('udp socket closed..')
})

server.on('message', function (message, remote) {
  counter++
  console.log('Received %d bytes from %s:%d\n', message.length, remote.address, remote.port)
  console.log('data comming at' + new Date())
  //var inByte = Buffer.from(message);
  //console.log(inByte.toString())
  //console.log(inByte.toString('hex'))
  console.log('counter = ', counter)
  var data = {server_counter: counter}
  try {
    console.log('message = ', message)
    var json = JSON.parse(message)
    console.log('json=>', json, typeof json)
    if (typeof json === 'number') {
      data = Object.assign({}, data, {device_counter: json})
    }
    else {
      data = Object.assign({}, data, json)
    }
  }
  catch (ex) {

    console.log('erorr', ex)
    console.log('+++++++++')
    console.log(message.toString())
    console.log('+++++++++')
  }
  console.log('=========')
  var out = Object.assign({}, {makerlab: data})
  console.log(out)
  if (out.makerlab.myName) {
    odin.publish('CMMC/apirak/' + out.makerlab.myName, JSON.stringify(out))
  }
  else {
    odin.publish('CMMC/apirak-nb/' + out.makerlab.myName, JSON.stringify(out))
  }

})
server.bind(PORT, HOST)
