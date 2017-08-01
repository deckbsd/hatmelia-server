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
    const _self = this;
    _self.once('getFinished', (body) => {
        onGetFinished(body);
    })

    _self.req.get(_self.buildRequest(url.url), (error, response, body) => {
        let html = null;
        let status = null;
        let failed = false;

        if (!error && response.statusCode === 200 && (response.headers['content-type'].includes('text/html') || response.headers['content-type'].includes('application/xhtml+xml'))){
            html = body;
        } else if(!error && response.statusCode != 200) {
            status = response.statusCode;
            failed = true;
        }else if(error) {
            failed = true;
        }

        _self.emit('getFinished', { html : html, status : status, error : error, failed : failed, url : url } );
    })
}

RequesterService.prototype.getValidUrl = function(url, onGotValidUrl){
    const _self = this;
    _self.once('gotValidUrl', (validUrl) => {
        onGotValidUrl(validUrl);
    })

    _self.req.get(_self.buildRequest(url), (error, response, body) => {
        let validUrl = null;
        if (!error && response.statusCode == 200){
            console.log(response);
            validUrl = response.request.uri;
        }
        
        _self.emit('gotValidUrl', validUrl);
    })
}

util.inherits(RequesterService, EventEmitter);

module.exports = RequesterService;