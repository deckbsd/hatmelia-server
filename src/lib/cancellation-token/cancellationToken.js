'use strict'
function CancellationToken() {
    const _self = this
    _self.token = true
}

CancellationToken.prototype.ThrowIfCancellationRequested = function () {
    const _self = this
    if (_self.token === false) {
        throw 'Task cancelled'
    }
}

CancellationToken.prototype.Cancel = function () {
    const _self = this
    _self.token = false
}

module.exports = CancellationToken