'use strict'
var IoState = function(){
    var that = this;
    that.requestRunning = false;
};

IoState.prototype.maxRequestReached = function(){
    var that = this;
    return that.requestRunning;
};

IoState.prototype.runRequest = function(){
    var that = this;
    that.requestRunning = true;
};

IoState.prototype.requestFinished = function(){
    var that = this;
    that.requestRunning = false;
}

module.exports = IoState;