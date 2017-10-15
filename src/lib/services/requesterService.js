'use strict'
const EventEmitter = require('events').EventEmitter
const URL = require('url')
const request = require('request-promise-native')
const util = require('util')

function RequesterService(){
    this.req = this.createRequest()
    this.selectAcceptEncodingHeader = function(protocol){
        if(protocol === 'https:'){
            return 'gzip, deflate, br'
        }

        return 'gzip, deflate, br'
    }.bind(this)
    this.buildRequest = function(url){
        return {
            url: url.href,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0 WOW64 rv:51.0) Gecko/20100101 Firefox/51.0',
                'Accept-Encoding': this.selectAcceptEncodingHeader(url.protocol)
            },
            gzip: true,
            deflate: true,
            jar: true
        }
    }.bind(this)
}

RequesterService.prototype.createRequest = function()
{
    return request.defaults()
}

RequesterService.prototype.get = async function(url)
{
    const _self = this
    let html = null
    let status = null
    let catched_error = null
    let failed = false
    try {
        const response = await _self.req.get(_self.buildRequest(url.url))  
        if (response.statusCode === 200 && (response.headers['content-type'].includes('text/html') || response.headers['content-type'].includes('application/xhtml+xml'))){
            html = body
        } else if(response.statusCode != 200) {
            status = response.statusCode
            failed = true
        }
        
        return { html : html, status : status, error : catched_error, failed : failed, url : url }
    }
    catch(error)
    {
        failed = true
        catched_error = error 
        return { html : html, status : status, error : catched_error, failed : failed, url : url }
    }
}

RequesterService.prototype.getValidUrl = async function(url){
    const _self = this
    let validUrl = null
    try {
        const response = await _self.req.get(_self.buildRequest(url))
        if (!error && response.statusCode == 200){
            console.log(response)
            validUrl = response.request.uri
        }

        return validUrl
    }
    catch(error)
    {
        return validUrl
    }
}

util.inherits(RequesterService, EventEmitter)

module.exports = RequesterService