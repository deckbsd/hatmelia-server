'use strict'
const EventEmitter = require('events').EventEmitter;
const URL = require('url');
const request = require('request');
const util = require('util');

function RequesterService(){
    this.req = this.createRequest();
    this.selectAcceptEncodingHeader = function(protocol){
        if(protocol === 'https:'){
            return 'gzip, deflate, br';

        }

        return 'gzip, deflate, br';
    }.bind(this);
    this.buildRequest = function(url){
        return {
            url: url.href,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0',
                'Accept-Encoding': this.selectAcceptEncodingHeader(url.protocol)
            },
            gzip: true,
            deflate: true,
            jar: true
        }
    }.bind(this);
}

RequesterService.prototype.createRequest = function()
{
    return request.defaults();
}

RequesterService.prototype.get = function(url, onGetFinished)
{
    let self = this;
    self.on('getFinished', (body) => {
        onGetFinished(body);
    });
    self.req.get(self.buildRequest(url), (error, response, body) => {
        let html = null;
        if (!error && response.statusCode == 200){
            html = body;
        }

        self.emit('getFinished', html);
    })
}

RequesterService.prototype.getValidUrl = function(url, onGotValidUrl){
    let self = this;
    self.on('gotValidUrl', (validUrl) => {
        onGotValidUrl(validUrl);
    });  
    self.req.get(self.buildRequest(url), (error, response, body) => {
        let validUrl = null;
        if (!error && response.statusCode == 200){
            console.log(response);
            validUrl = response.request.uri;
        }
        
        self.emit('gotValidUrl', validUrl);
    })
}

util.inherits(RequesterService, EventEmitter);

module.exports = RequesterService;