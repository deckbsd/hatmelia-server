'use strict'
const URL = require('url');
const HtmlService = require('../lib/services/htmlService');

let clientCounter = 0;
function LinksNamespace(){
    this.checkIfValidParameter = function(query){
        if(!query || typeof(query) != 'string'){
            throw 'invalid-parameter';
        }
    }.bind(this);

    this.buildValidUrl = function(url){
        var validUrl = URL.parse(url);
        if(validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:'){
            throw 'protocol-not-supported';
        }
        return validUrl;
    }.bind(this);
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
        const limitation = new RequestLimitation(config.ionamespaces.links.maxRequest);
        console.log('client ' + socket.id + ' connected');
        clientCounter++;
        socket.on('check-for-dead', (query) => {
            try{
                if(limitation.requestAllowed() === false){
                    throw 'max-request';
                }
                
                that.checkIfValidParameter(query);
                let validUrl = that.buildValidUrl(query);
                limitation.newRequest();
                new HtmlService(socket).checkDeadLinks(validUrl, function(){
                    limitation.requestFinished();
                });
            }catch(err)
            {
                socket.emit('server-error', err);
            }
        });
        socket.on('disconnect', () => {
            console.log('client ' + socket.id + ' disconnected');
            clientCounter--;
        });
    });
}

module.exports = LinksNamespace;
