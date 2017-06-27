'use strict'
let config = require('./config.json')
let HtmlService = require('./lib/services/html-service');
let IoState = require('./lib/io-state/io-state');
let server = require('http').createServer();
let io = require('socket.io')(server);
let port = process.env.PORT || config.server.port;
let clientCounter = 0;
io.origins(config.cors);

let linksNamespace = io.of(config.ionamespaces.links);
linksNamespace.use(function(socket, next){
    if(clientCounter < config.server.maximumClients){
        next();
    }
    else{
        socket.disconnect(true);
    }  
});
linksNamespace.on('connection', function(socket) {
    let state = new IoState();
    console.log('client ' + socket.id + ' connected');
    clientCounter++;
    socket.on('check-for-dead', (query) => {
        if(state.maxRequestReached() === false){
            new HtmlService(socket).checkDeadLinks("http://test.com", function(){
                state.requestFinished();
            });
            state.runRequest();
        }
    });
    socket.on('disconnect', () => {
        console.log('client ' + socket.id + ' disconnected');
        clientCounter--;
    });
});

server.listen(port, _=>{
    console.log('socket server listening on port : ' + port);
});