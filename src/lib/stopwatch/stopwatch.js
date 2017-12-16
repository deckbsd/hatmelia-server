'use strict'
function StopWatch(socket, requesterService) {
    const _self = this
    _self.startTime = 0
    _self.elapsedNano = 0.0
    _self.elapsedSeconds = 0.0
}

StopWatch.prototype.startNew = function () {
    const _self = this
    _self.startTime = process.hrtime()
}

StopWatch.prototype.stop = function () {
    const _self = this
    _self.elapsedNano = process.hrtime(_self.startTime)[1]
    _self.elapsedSeconds = process.hrtime(_self.startTime)[0]
}

StopWatch.prototype.elapsedNanoseconds = function () {
    const _self = this
    let nanoseconds = _self.elapsedNano
    nanoseconds += _self.elapsedSeconds * 1000000000
    return nanoseconds
}

StopWatch.prototype.elapsedMilliseconds = function (precision) {
    const _self = this
    let milli = _self.elapsedNano / 1000000
    milli += _self.elapsedSeconds * 1000
    if (!precision)
        return milli

    return milli.toFixed(precision)
}

StopWatch.prototype.elapsedSeconds = function () {
    const _self = this
    return _self.elapsedSeconds
}

StopWatch.prototype.logInHMS = function () {
    const _self = this
    let ms = _self.elapsedMilliseconds()
    let seconds = ms / 1000
    let hours = parseInt(seconds / 3600)
    seconds = seconds % 3600
    let minutes = parseInt(seconds / 60)
    seconds = seconds % 60
    let log = ""
    if (hours > 0)
        log = log + hours + " h "
    if (minutes > 0)
        log = log + minutes + " m "

    log = log + seconds + " s"
    return log
}

module.exports = StopWatch