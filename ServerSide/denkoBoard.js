/**
 * Created by nwilson on 6/8/2015.
 */
//Link dependencies
var express = require('express');
var Forecast = require('forecast.io');

//Setup server
var app = express();
var port = 1337;

//Weather setup
var forecastAPIKey = '285d7483f9acc0b5ddf7066e1e238e29';
var forecast = new Forecast({APIKey: forecastAPIKey});
var latitude = 42.01915;
var longitude = -93.64638;
var weather = {};

app.use(express.static('../ClientSide/', {
    extensions: ['html']
}));

//Start web server
var server = app.listen(port, function () {
    //Server setup
    getWeather();

    //Server started
    console.log('Denko Board server running on port ' + port);
});

//Gets weather from server and parses it
var getWeather = function(){
    //Options for forecast call
    var forecastOptions = {
        'exclude': 'minutely,daily,flags'
    };

    //Performs request and parses data
    forecast.get(latitude, longitude, forecastOptions, function( err, res, data){
        if (err) throw err;
        //Weather object setup
        weather = {
            currentWeather: {},
            hours: []
        };

        //Current weather assignment
        //weather.currentWeather.time = new Date(data.currently.time * 1000).toLocaleTimeString();
        weather.currentWeather.temperature = data.currently.temperature;
        weather.currentWeather.conditions = data.currently.summary;

        //Hourly weather handling
        for(var i = 0; i < data.hourly.data.length; i++) {
            //Current hour
            var hour = data.hourly.data[i];
            var dateObj = new Date(hour.time * 1000);

            //Hour object that gets appended to weather.hours
            var hourObj = {
                'date': dateObj.toLocaleDateString(),
                'time': dateObj.toLocaleTimeString(),
                'temperature': hour.temperature,
                'conditions': hour.summary
            };
            weather.hours.push(hourObj);
        }
    });
    //Schedules weather refresh every 15 minutes
    //setTimeout(getWeather(), 900000);
    console.log('Weather refreshed');
};

/*
 Websocket stuff
 */

//Start websocket server
var io = require('socket.io').listen(server);

//Socket routes
io.on('connection', function (socket) {
    console.log('A user has connected');

    socket.on('getWeather', function(){
       socket.emit('updateWeather', weather);
    });

    socket.on('disconnect', function () {
        console.log('A user has disconnected')
    });
});