'use strict'
let express = require('express');
let htmlController = require('../controllers/htmlController')();

var routes = _=>{
    var router = express.Router();
    router.use('/checklinks', (req, res, next) => {
        if(req.query.id === undefined || req.query.url === undefined){
            res.status(400);
            res.send('bad parameters');
        }

        next();
    });
    router.route('/checklinks').get(htmlController.get);
    return router;
};

module.exports = routes;