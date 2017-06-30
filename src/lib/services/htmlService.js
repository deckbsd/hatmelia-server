'use strict'
function HtmlService(socket){
    var that = this;
    that.socket = socket;
};

HtmlService.prototype.checkDeadLinks = async function(url, callback) {
    var that = this;
    var millisecondsToWait = 10000;
    setTimeout(function() {
        that.socket.emit('test', url);
        callback();
    }, millisecondsToWait); 
};

module.exports = HtmlService;