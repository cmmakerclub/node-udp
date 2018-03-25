var cmmc = require('mqtt').connect('mqtt://cmmc:cmmc@odin.cmmc.io:')

cmmc.on('connect', function () { console.log('cmmc connected') }) 
cmmc.on('packetsend', function(packet) { 
console.log(packet);
});
