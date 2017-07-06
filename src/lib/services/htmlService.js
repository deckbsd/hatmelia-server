'use strict'
const EventEmitter = require('events').EventEmitter;
const RequesterService = require('./requesterService');
const cheerio = require('cheerio');
const util = require('util');

function HtmlService(socket){
    var that = this;
    that.socket = socket;
    that.requesterService = new RequesterService();
    that.urlsToProcess = [];
    that.urlsProcessed = [];
};

HtmlService.prototype.deadLinksRequest = async function(url, onFinished) {
    var that = this;
    that.on('requestFinished', onFinished);
    that.requesterService.getValidUrl(url, that.start.bind(this));
};

HtmlService.prototype.start = function(validUrl){
    var that = this;
    if(!validUrl){
        that.socket.emit('server-error', 'website-not-found');
        that.emit('requestFinished');
    }else{
        console.log(validUrl);
        that.requesterService.get(validUrl, that.pushLinks.bind(this));
        var millisecondsToWait = 10000;
        setTimeout(function() {
            that.socket.emit('test', validUrl);
            that.emit('requestFinished');
        }, millisecondsToWait);
    }
}

HtmlService.prototype.pushLinks = function(body){
    if(!body){
        return;
    }
    const that = this;
    const $ = cheerio.load(body);
    const links = $('a');
    $(links).each(function(i, link){
        const linkText = $(link).attr('href');
        console.log(linkText);
        that.urlsToProcess.push(linkText);
    });
}

util.inherits(HtmlService, EventEmitter);

module.exports = HtmlService;