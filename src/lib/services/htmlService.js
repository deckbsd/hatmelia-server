'use strict'
const EventEmitter = require('events').EventEmitter;
const RequesterService = require('./requesterService');
const util = require('util');

function HtmlService(socket){
    var that = this;
    that.socket = socket;
    that.requesterService = new RequesterService();
};

HtmlService.prototype.deadLinksRequest = async function(url, onFinished) {
    var that = this;
    that.on('requestFinished', onFinished);
    that.requesterService.getValidUrl(url, that.checkDeadLinks.bind(this));
};

HtmlService.prototype.checkDeadLinks = function(validUrl){
    var that = this;
    if(!validUrl){
        that.socket.emit('server-error', 'website-not-found');
        that.emit('requestFinished');
    }else{
        console.log(validUrl);
        var millisecondsToWait = 10000;
        setTimeout(function() {
            that.socket.emit('test', validUrl);
            that.emit('requestFinished');
        }, millisecondsToWait);
    }
}

util.inherits(HtmlService, EventEmitter);

module.exports = HtmlService;