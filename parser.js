const Parser = require('binary-parser').Parser
const cmmcParser = require('./sensor')
const tailParser = require('./tail')
const formatters = require('./formatter')
const parser = Parser.start() 
  .endianess('big')
  .array('header', {
    type: 'uint8',
    length: 2,
    formatter: arr => Buffer.from(arr).toString('hex')
  })
  .uint8('version')
  .uint8('project')
  .array('reserved', {
    type: 'uint8',
    length: 4,
    formatter: formatters.toHextString
  })
  .uint8('nameLen')
  .string('device_name', {length: 16, stripNull: true})
  .uint32('sleepTime')
  .uint32('ms')
  .nest('sensor', {type: cmmcParser})
  .nest('tail', {type: tailParser})

module.exports = parser
