'use strict'
const EventEmitter = require('events').EventEmitter
const StopWatch = new (require('../stopwatch/stopwatch'))
const config = require('../../config.json')
const SortedList = require('sortedlist')
const cheerio = require('cheerio')
const serverEvents = require('./serverEvents')
const async = require('async')
const util = require('util')
const URL = require('url')

function HtmlService(socket, requesterService) {
    const _self = this
    _self.socket = socket
    _self.cancelled = false
    _self.requesterService = requesterService
    _self.urlsToProcess = async.queue(_self.processUrl.bind(this), config.html_service.concurrency)
    _self.urlsToProcess.drain = _self.requestFinished.bind(this)
    _self.processedUrls = SortedList.create({ compare: "string" })
    _self.deadLinkFound = SortedList.create({ compare: function(a,b) { return (a[0] > b[0]) ? 1 : (a[0] == b[0]) ? 0 : -1} })
    _self.rootUrl = null
    _self.checkedLinksTotal = 0
}

HtmlService.prototype.requestFinished = function () {
    const _self = this
    StopWatch.stop()
    _self.socket.emit(serverEvents.REQUEST_FINISHED, StopWatch.elapsedMilliseconds())
    console.log(StopWatch.logInHMS())
    _self.emit(serverEvents.REQUEST_FINISHED)
}

HtmlService.prototype.processUrl = async function (urlToNavigate) {
    const _self = this
    if (_self.isCancelled()) {
        return
    }

    const result = await _self.requesterService.get(urlToNavigate)
    _self.pushLinks(result)
}

HtmlService.prototype.deadLinksRequest = async function (url, onFinished) {
    const _self = this
    _self.once(serverEvents.REQUEST_FINISHED, onFinished)
    _self.requesterService.getValidUrl(url).then(function (validUrl) {
        _self.start(validUrl)
        // _self.start(validUrl).bind(this)
    })
}

HtmlService.prototype.start = function (validUrl) {
    const _self = this
    if (!validUrl) {
        _self.socket.emit(serverEvents.SERVER_ERROR, 'Website not found')
        _self.emit(serverEvents.REQUEST_FINISHED)
    } else {
        _self.socket.emit(serverEvents.REQUEST_STARTED)
        _self.rootUrl = validUrl
        _self.processedUrls.insertOne(validUrl.href)
        StopWatch.startNew()
        _self.urlsToProcess.push({ from: validUrl, url: validUrl })
    }
}

HtmlService.prototype.pushLinks = function (result) {
    const _self = this
    if (_self.isCancelled()) {
        return
    }

    _self.checkedLinksTotal++
    _self.socket.emit(serverEvents.LINK_CHECKED, _self.checkedLinksTotal)
    if (!result.failed) {
        if (result.html !== null && _self.isSameDomain(_self.rootUrl.host, result.url.url.host)) {
            let $ = cheerio.load(result.html)
            $('a').each(function () {
                let to = _self.buildLink(result.url.url, this.attribs.href)
                if (!to) {
                    return
                }

                _self.CheckIfLinkToProceedOrNot(result.url.url, to)
            })
        }
    }
    else {
        const reason = result.status !== undefined ? result.status : result.error
        _self.sendDeadLinkFounded(result.url.from.href, result.url.url.href, reason)
        _self.addDeadLinkToList(result.url.url.href, reason)
    }
}

HtmlService.prototype.sendDeadLinkFounded = function (from, dead, reason) {
    const _self = this
    _self.socket.emit(serverEvents.DEAD_LINK_DETECTED, { from: from, url: dead, reason: reason })
    console.log("from : " + from + " url : " + dead + " reason : " + reason)
}

HtmlService.prototype.addDeadLinkToList = function (dead, reason) {
    const _self= this
    console.log('add : ' + dead)
    _self.deadLinkFound.insertOne([dead, reason])
}
/* TO READ !
 * Re-send the dead url if the link is present in other pages that
 * the first one where the program found it. BUT, if the dead url are
 * into a lot of pages, due to the async process, during the very short time (less than one second)
 * between the add to processedUrls and the call to addDeadLinkToList some
 * of the dead url's occurences can be missed. The only way to be sure to have
 * all the dead url occurences in one time, is to do the get request. But it's not
 * optimum and some of websites can ban your ip or take some other actions against you.
 */

HtmlService.prototype.isOtherDeadOccurence = function (from, dead) {
    const _self = this
    const index = _self.deadLinkFound.key([dead.href])
    if (index === null)
        return

    _self.sendDeadLinkFounded(from.href, dead.href, _self.deadLinkFound[index][1])
}

HtmlService.prototype.cancel = function () {
    const _self = this
    _self.cancelled = true
    _self.urlsToProcess.kill()
}

HtmlService.prototype.isCancelled = function () {
    const _self = this
    return _self.cancelled === true
}

HtmlService.prototype.buildLink = function (from, path) {
    const _self = this
    if (!path) {
        return
    }

    path = path.trim()
    if (!_self.isNotLoop(path) || _self.isSpecialLink(path))
        return

    let to = null
    if (_self.isAnAddress(path)) {
        to = URL.parse(_self.buildAddress(path))
    } else {
        to = URL.parse(URL.resolve(from.href, path))
    }

    return to
}

HtmlService.prototype.CheckIfLinkToProceedOrNot = function (from, to) {
    const _self = this
    if (_self.processedUrls.key(to.href) !== null) {
        _self.isOtherDeadOccurence(from, to)
        return
    }     

    _self.processedUrls.insertOne(to.href)
    _self.urlsToProcess.push({ from: from, url: to })
}

HtmlService.prototype.isSameDomain = function (base, url) {
    return base === url
}

HtmlService.prototype.isNotLoop = function (path) {
    if (path === undefined || path === null || path === "")
        return false

    if (path.startsWith("#"))
        return false

    if (path.length > 1)
        return true

    return path[0] !== '/'
}

HtmlService.prototype.isAnAddress = function (url) {
    return url.startsWith("http") || url.startsWith("www")
        || url.startsWith("//")
}

HtmlService.prototype.buildAddress = function (url) {
    if (url.startsWith("//http"))
        return url.slice(2)

    if (url.startsWith("//"))
        return "http:" + url //check HTTPS ?

    return url
}

HtmlService.prototype.isSpecialLink = function (path) {
    return path.startsWith("mailto:") || path.startsWith("tel:")
}

util.inherits(HtmlService, EventEmitter)

module.exports = HtmlService