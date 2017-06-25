'use strict'
let config = require('./config.json')
let express = require('express');
let app = express();
let htmlServiceModule = require('./lib/htmlService');
let apiRouter = require('./routes/apiRoutes')();
let server = require('http').Server(app);
let io = require('socket.io')(server);
io.origins(config.cors);
var port = process.env.PORT || config.server.port;

app.use('/api/v1', apiRouter);
app.get('/', (req, res) => {
    res.send('hatmelia api')
});

server.listen(port, _=>{
    console.log('listening on port : ' + port);
});