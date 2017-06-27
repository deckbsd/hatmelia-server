'use strict'
var HtmlService = function(socket){
    var that = this;
    that.socket = socket;
};

HtmlService.prototype.checkDeadLinks = function(url, callback) {
    var that = this;
    that.socket.emit('test', 'result');
    callback();
};

module.exports = HtmlService;