'use strict'
let config = require('./config.json')
let express = require('express');
let app = express();
let parser = require('./lib/crawler');
let server = require('http').Server(app);
let io = require('socket.io')(server);
var port = process.env.PORT || config.server.port;
var router = express.Router();
io.origins(config.cors);

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

server.listen(port, _=>{
    console.log('listening on port : ' + port);
});