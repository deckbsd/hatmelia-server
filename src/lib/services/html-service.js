'use strict'
var HtmlService = function(ioHtml){
    var that = this;
    that.ioHtml = ioHtml;
};

HtmlService.prototype.checkDeadLinks = function(id, url, callback) {
    console.log('id : ' + id + ' url : ' + url);
    ioHtml.emit('test', 'toto');
    callback();
};

module.exports = HtmlService;