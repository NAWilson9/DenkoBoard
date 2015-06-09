/**
 * Created by nwilson on 6/8/2015.
 */
//Link dependencies
var express = require('express');

//Setup server
var app = express();
var port = 1337;
app.use(express.static('../ClientSide/', {
    extensions: ['html']
}));

//Start web server
var server = app.listen(port, function () {
    console.log('Denko Board server running on port ' + port);
});

/*
 Websocket stuff
 */

//Start websocket server
var io = require('socket.io').listen(server);

//Socket routes
io.on('connection', function (socket) {

    socket.on('disconnect', function () {

    });
});