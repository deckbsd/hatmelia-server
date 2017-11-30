'use strict'
const config = require('./config.json')
const ioNamespaces = require('./ionamespaces')
const server = require('http').createServer()
const io = require('socket.io')(server)
const port = process.env.PORT || config.server.port
const clientCounter = 0
io.origins(config.server.cors)

ioNamespaces.init(io)

server.listen(port, _=>{
    console.log('socket server listening on port : ' + port)
})

