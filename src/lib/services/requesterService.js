'use strict'
const EventEmitter = require('events').EventEmitter;
const URL = require('url');
const request = require('request');
const util = require('util');

function RequesterService(){
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
            deflate: true
        }
    }.bind(this);
}

RequesterService.prototype.get = function(url, onGetFinished)
{
    let that = this;
    that.on('getFinished', (body) => {
        onGetFinished(body);
    });
    request(that.buildRequest(url), (error, response, body) => {
        let html = null;
        if (!error && response.statusCode == 200){
            html = body;
        }

        that.emit('getFinished', html);
    })
}

RequesterService.prototype.getValidUrl = function(url, onGotValidUrl){
    let that = this;
    that.on('gotValidUrl', (validUrl) => {
        onGotValidUrl(validUrl);
    });  
    request(that.buildRequest(url), (error, response, body) => {
        let validUrl = null;
        if (!error && response.statusCode == 200){
            console.log(response);
            validUrl = response.request.uri;
        }
        
        that.emit('gotValidUrl', validUrl);
    })
}

util.inherits(RequesterService, EventEmitter);

module.exports = RequesterService;