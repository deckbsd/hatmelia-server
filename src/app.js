'use strict'
let config = require('./config.json');
let ioNamespaces = require('./ionamespaces');
let server = require('http').createServer();
let io = require('socket.io')(server);
let port = process.env.PORT || config.server.port;
let clientCounter = 0;
io.origins(config.cors);

ioNamespaces.init(io);

server.listen(port, _=>{
    console.log('socket server listening on port : ' + port);
});

