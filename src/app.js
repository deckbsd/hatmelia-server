'use strict'
let express = require('express');
let parser = require('./lib/crawler')
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

var checkLinksController = (req, res) =>
{
    if(req.query.id === undefined || req.query.url === undefined){
        res.status(400);
        res.send('bad parameters');
    }

    res.status(200);
    res.send();  
};

router.route('/checklinks').get(checkLinksController);
app.use('/api/v1', router);
app.get('/', (req, res) => {
    res.send('hatmelia api')
});

app.listen(port, _=>{
    console.log('listening on port : ' + port);
});