'use strict'
let htmlServiceModule = require('../lib/htmlService');

var htmlController = _=>
{
    let that = this;
    that.get = (req, res) => {
        var service = new htmlServiceModule();

        res.status(200);
        res.send(); 
    };

    return {
        get: that.get
    }
};

module.exports = htmlController;