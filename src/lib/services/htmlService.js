'use strict'
const EventEmitter = require('events').EventEmitter;
const StopWatch = new (require('../stopwatch/stopwatch'));
const SortedList = require('sortedlist')
const cheerio = require('cheerio');
const util = require('util');
const URL = require('url');

function HtmlService(socket, requesterService){
    const _self = this;
    _self.socket = socket;
    _self.requesterService = requesterService;
    _self.urlsToProcess = [];
    _self.processedUrls = SortedList.create({ compare: "string" });
    _self.rootUrl = null;
    _self.checkedLinksTotal = 0;
};

HtmlService.prototype.deadLinksRequest = async function(url, onFinished) {
    const _self = this;
    _self.once('requestFinished', onFinished);
    _self.requesterService.getValidUrl(url, _self.start.bind(this));
};

HtmlService.prototype.start = function(validUrl){
    const _self = this;
    if(!validUrl){
        _self.socket.emit('server-error', 'website-not-found');
        _self.emit('requestFinished');
    }else{
        _self.rootUrl = validUrl;
        _self.processedUrls.insertOne(validUrl.href);
        StopWatch.startNew();
        _self.requesterService.get({ from : validUrl, url : validUrl}, _self.pushLinks.bind(this))
    }
}

HtmlService.prototype.pushLinks = function(result){
    const _self = this;

    _self.checkedLinksTotal++;
    _self.socket.emit('linkChecked', _self.checkedLinksTotal);
    if(!result.failed) {
        if(result.html !== null && _self.isSameDomain(_self.rootUrl.host, result.url.url.host)) {
            let $ = cheerio.load(result.html);
            $('a').each(function() {
                _self.buildLink(result.url.url, this.attribs.href)
            })
        }
    }
    else {
        _self.socket.emit('deadlinkDetected', { from : result.url.from.href, url : result.url.url.href, reason : result.status || result.error});
        console.log("from : " + result.url.from.href + " url : " + result.url.url.href + " reason : " + result.status || result.error)
    }

    if(_self.urlsToProcess.length > 0){
        let urlToNavigate = _self.urlsToProcess.pop();
        _self.requesterService.get(urlToNavigate, _self.pushLinks.bind(this)) 
    } else {
        StopWatch.stop();
        _self.socket.emit('requestFinished', StopWatch.elapsedMilliseconds());
        console.log(StopWatch.logInHMS());
        _self.emit('requestFinished');
    }
}

HtmlService.prototype.buildLink = function(from, path) {
    const _self = this;
    if(!path){
        return;
    }

    path = path.trim();
    if(!_self.isNotLoop(path) || _self.isSpecialLink(path))
        return;

    let to = null;
    if(_self.isAnAddress(path)) {
        to = URL.parse(_self.buildAddress(path));
    } else {
        to = URL.parse(URL.resolve(from.href, path));
    }

    if(_self.processedUrls.key(to.href) !== null)
        return;

    _self.processedUrls.insertOne(to.href);
    _self.urlsToProcess.push( {from : from, url : to });
}

HtmlService.prototype.isSameDomain = function(base, url) {
    return base === url
}

HtmlService.prototype.isNotLoop = function(path) {
    if (path === undefined || path === null || path === "")
        return false;

    if (path.startsWith("#"))
        return false;

    if (path.length > 1)
        return true;

    return path[0] !== '/';
}

HtmlService.prototype.isAnAddress = function(url) {
    return url.startsWith("http") || url.startsWith("www")
                || url.startsWith("//");
}

HtmlService.prototype.buildAddress = function(url) {
    if (url.startsWith("//http"))
        return url.slice(2);

    if (url.startsWith("//"))
        return "http:" + url; //check HTTPS ?

    return url;
}

HtmlService.prototype.isSpecialLink = function(path) {
    return path.startsWith("mailto:") || path.startsWith("tel:");
}

util.inherits(HtmlService, EventEmitter);

module.exports = HtmlService;