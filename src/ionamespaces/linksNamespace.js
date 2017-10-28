'use strict'
const URL = require('url')
const HtmlService = require('../lib/services/htmlService')
const RequesterService = require('../lib/services/requesterService')
const ProxiedRequesterService = require('../lib/services/proxiedRequesterService')

let clientCounter = 0
function LinksNamespace() {
    this.checkIfValidParameter = function (query) {
        if (!query || typeof (query) != 'string') {
            throw 'invalid-parameter'
        }
    }.bind(this)

    this.createUrl = function (url) {
        let validUrl = URL.parse(url)
        if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') {
            throw 'protocol-not-supported'
        }

        return validUrl
    }.bind(this)
}

LinksNamespace.prototype.init = function (io, config, RequestLimitation) {
    var that = this
    let linksNamespace = io.of(config.ionamespaces.links.name)
    linksNamespace.use(function (socket, next) {
        if (clientCounter < config.server.maximumClients) {
            next()
        }
        else {
            socket.disconnect(true)
        }
    })
    linksNamespace.on('connection', function (socket) {
        let limitation = new RequestLimitation(config.ionamespaces.links.maxRequest)
        let htmlService = null
        console.log('client ' + socket.id + ' connected')
        clientCounter++
        socket.on('check-for-dead', (query) => {
            try {
                if (limitation.requestAllowed() === false) {
                    throw 'max-request'
                }

                that.checkIfValidParameter(query)
                var url = that.createUrl(query)
                limitation.newRequest()
                let requester = that.createRequester(config)
                htmlService = new HtmlService(socket, requester)
                htmlService.deadLinksRequest(url, _ => {
                    limitation.requestFinished()
                    requester = null
                    htmlService = null
                })
            } catch (err) {
                socket.emit('server-error', err)
            }
        })
        socket.on('disconnect', () => {
            htmlService.cancel()
            htmlService = null
            limitation = null
            clientCounter--
            console.log('client ' + socket.id + ' disconnected')
        })
    })
}

LinksNamespace.prototype.createRequester = function (config) {
    if (config.proxy) {
        return new ProxiedRequesterService(config.proxy_addr)
    }

    return new RequesterService()
}

module.exports = LinksNamespace
