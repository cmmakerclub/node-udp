const Parser = require('binary-parser').Parser

const sensorNodeParser = Parser.start().endianess('big')
  .array('from', {
    type: 'uint8',
    length: 6,
    formatter: arr => Buffer.from(arr).toString('hex')
  })
  .array('to', {
    type: 'uint8',
    length: 6,
    formatter: arr => Buffer.from(arr).toString('hex')
  })
  .endianess('little')
  .uint8('type')
  .uint32('ais_battery')
  .uint32('ais_distance')
  .uint32('ais_temperature')
  .uint32('ais_pressure')
  .uint32('ais_altitude')
  .uint32('ais_humidity')
  .uint32('ais_sleeptime')
  .uint8('name_len')
  .string('device_name', {length: 16, stripNull: true})
  .uint32('node_ms')
  .uint32('sent_ms')
  .uint32('checksum')


module.exports =  sensorNodeParser
