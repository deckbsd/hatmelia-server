'use strict'
const config = require('../config.json')
const RequestLimitation = require('../lib/request-limitation/requestLimitation')
const LinksNameSpace = new (require('./linksNamespace'))

exports.init = (io) => {
    LinksNameSpace.init(io, config, RequestLimitation)
}