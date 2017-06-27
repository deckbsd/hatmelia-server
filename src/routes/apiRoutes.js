'use strict'
let express = require('express');
let HtmlController = require('../controllers/htmlController');
let HtmlService = require('../lib/htmlService/htmlService');

var routes = _=>{
    var router = express.Router();
    router.use('/checklinks', (req, res, next) => {
        if(req.query.id === undefined || req.query.url === undefined){
            res.status(400);
            res.send('bad parameters');
        }

        next();
    });
    router.route('/checklinks').get((req, res) => {
        new HtmlController(new HtmlService()).get(req, res);
    });
    return router;
};

module.exports = routes;