'use strict'
let HtmlService = require('../lib/services/htmlService');

let clientCounter = 0;
var LinksNamespace = function(){
    var that = this;
};

LinksNamespace.prototype.init = function(io, config, RequestLimitation)
{
    var that = this;
    let linksNamespace = io.of(config.ionamespaces.links.name);
    linksNamespace.use(function(socket, next){
        if(clientCounter < config.server.maximumClients){
            next();
        }
        else{
            socket.disconnect(true);
        }  
    });
    linksNamespace.on('connection', function(socket) {
        let limitation = new RequestLimitation(config.ionamespaces.links.maxRequest);
        console.log('client ' + socket.id + ' connected');
        clientCounter++;
        socket.on('check-for-dead', (query) => {
            if(limitation.requestAllowed() === true){
                limitation.newRequest();
                new HtmlService(socket).checkDeadLinks(query, function(){
                    limitation.requestFinished();
                });
            }
            else {
                socket.emit('server-error', 'max-request');
            }
        });
        socket.on('disconnect', () => {
            console.log('client ' + socket.id + ' disconnected');
            clientCounter--;
        });
    });
}

module.exports = LinksNamespace;
