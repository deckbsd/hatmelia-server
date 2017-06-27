'use strict'
let config = require('./config.json')
let HtmlService = require('./lib/services/html-service');
let IoState = require('./lib/io-state/io-state');
let server = require('http').createServer();
let io = require('socket.io')(server);
io.origins(config.cors);
var port = process.env.PORT || config.server.port;

let linksNamespace = io.of(config.ionamespaces.links);
linksNamespace.use(function(socket, next){
    if(1 <= config.server.maximumClients){
        next();
    }
    socket.close();
});
linksNamespace.on('connection', function(socket) {
    let state = new IoState();
    socket.on('check-for-dead', (query) => {
        if(state.maxRequestReached() === false){
            new HtmlService(linksNamespace).checkDeadLinks(1, "http://test.com", function(){
                state.requestFinished();
            });
            state.runRequest();
        }
    });
});

server.listen(port, _=>{
    console.log('socket server listening on port : ' + port);
});