var express = require('express');

var checkLinksController = (req, res) =>
{
    if(req.query.id === undefined || req.query.url === undefined){
        res.status(400);
        res.send('bad parameters');
    }

    var service = new htmlServiceModule();

    res.status(200);
    res.send();  
};

var routes = _=>{
    var router = express.Router();
    router.route('/checklinks').get(checkLinksController);
    return router;
};

module.exports = routes;