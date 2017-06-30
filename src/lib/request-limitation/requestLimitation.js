'use strict'
var RequestLimitation = function(limit){
    var that = this;
    that.limit = limit;
    that.requestsRunning = 0;
};

RequestLimitation.prototype.requestAllowed = function(){
    var that = this;
    return that.requestsRunning < that.limit;
};

RequestLimitation.prototype.newRequest = function(){
    var that = this;
    that.requestsRunning++;
};

RequestLimitation.prototype.requestFinished = function(){
    var that = this;
    that.requestsRunning--;
};

module.exports = RequestLimitation;