'use strict'
let config = require('../config.json');
let RequestLimitation = require('../lib/request-limitation/requestLimitation');
let LinksNameSpace = new (require('./linksNamespace'));

exports.init = (io) => {
    LinksNameSpace.init(io, config, RequestLimitation);
}