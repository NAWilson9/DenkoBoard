/**
 * Created by nwilson on 6/8/2015.
 */
//Link dependencies
var express = require('express');
var Forecast = require('forecast.io');

//Setup server
var app = express();
var port = 1337;
var users = 0;

//Weather setup
var forecastAPIKey = '285d7483f9acc0b5ddf7066e1e238e29';
var forecast = new Forecast({APIKey: forecastAPIKey});
var latitude = 42.01915;
var longitude = -93.64638;
var hoursToShow = 8;
var weatherImageSet = '/Images/WeatherIcons/';
var weather = {
    currently: '',
    hourly: [],
    alerts: []
};

app.use(express.static('../ClientSide/', {
    extensions: ['html']
}));

//Start web server
var server = app.listen(port, function () {
    //Initialize
    getWeather();

    //Server started
    console.log('Denko Board server running on port ' + port);
});

//Gets weather from server and parses it
var getWeather = function(){
    //Options for forecast call
    var forecastOptions = {
        'exclude': 'minutely,daily,flags',
        'lang': 'en',
        'units': 'us'
    };

    //Performs request and parses data
    forecast.get(latitude, longitude, forecastOptions, function( err, res, data){
        if (err) throw err;

        //Currently weather handling
        if(data.currently){
            var currently = data.currently;
            var currentDate = new Date(currently.time * 1000);
            weather.currently = {
                'date': (currently.time) ? currentDate.toLocaleDateString() : 'ERROR',
                'time': (currently.time) ? currentDate.toLocaleTimeString() : 'ERROR',
                'temperature': (currently.temperature) ? Math.round(currently.temperature) : 'ERROR',
                'conditions': (currently.summary) ? currently.summary : 'ERROR',
                'image': (currently.icon) ? weatherImageSet + currently.icon + '.png' : ''
            };
        }

        //Hourly weather handling
        if(data.hourly){
            for(var i = 0, j = 0; i < data.hourly.data.length && j < hoursToShow - 1; i++) {
                var hourly = data.hourly.data[i];
                var hourlyDate = new Date(hourly.time * 1000);
                var hourObj = {
                    'date': (hourly.time) ? hourlyDate.toLocaleDateString() : 'ERROR',
                    'time': (hourly.time) ? hourlyDate.toLocaleTimeString() : 'ERROR',
                    'temperature': (hourly.temperature) ? Math.round(hourly.temperature) : 'ERROR',
                    'conditions': (hourly.summary) ? hourly.summary : 'ERROR',
                    'image': (hourly.icon) ? weatherImageSet + hourly.icon + '.png' : ''
                };
                //Todo Needs proper error checking
                if(hourObj.time.charAt(0) != weather.currently.time.charAt(0)){
                    weather.hourly.push(hourObj);
                    j++;
                }
            }
        }

        //Severe weather alert handling
        if(data.alerts){
            for(var k = 0; k < data.alerts.length; k++){
                var alert = data.alerts[k];
                var alertDate = new Date(alert.expires * 1000);
                var alertObj = {
                    'title': (alert.title) ? alert.title : 'ERROR',
                    'expires-date': (alert.expires) ? alertDate.toLocaleDateString() : 'ERROR',
                    'expires-time': (alert.expires) ? alertDate.toLocaleTimeString() : 'ERROR',
                    'description': (alert.description) ? alert.description : 'ERROR',
                    'uri': (alert.uri) ? alert.uri : 'ERROR'
                };
                weather.alerts.push(alertObj);
            }
        }
    });
    //Weather was retrieved and parsed successfully
    console.log('Weather refreshed');
    //Schedules weather refresh every 3 minutes
    setTimeout(getWeather, 300000);
};

/*
 Websocket stuff
 */

//Start websocket server
var io = require('socket.io').listen(server);

//Socket routes
io.on('connection', function (socket) {
    users++;
    console.log('A user has connected. Total users: ' + users);

    //Responds to weather refresh requests and returns the forecast
    socket.on('getWeather', function(){
       socket.emit('updateWeather', weather);
    });

    //A user has disconnected
    socket.on('disconnect', function () {
        users--;
        console.log('A user has disconnected. Total users: ' + users);
    });
});