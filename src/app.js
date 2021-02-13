'use strict'
const config = require('./config.json')
const ioNamespaces = require('./ionamespaces')
const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: config.server.cors,
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
})
const port = process.env.PORT || config.server.port

ioNamespaces.init(io)

server.listen(port, _=>{
    console.log('socket server listening on port : ' + port)
})

