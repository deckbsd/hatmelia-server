'use strict'
const RequesterService = require('./requesterService');
const request = require('request');
const util = require('util');

function ProxiedRequesterService(proxy) {
    this.proxyUrl = proxy;
    RequesterService.call(this);
}

ProxiedRequesterService.prototype.createRequest = function() {
    const self = this;
    return request.defaults({ proxy: self.proxyUrl });
}

util.inherits(ProxiedRequesterService, RequesterService);

module.exports = ProxiedRequesterService;