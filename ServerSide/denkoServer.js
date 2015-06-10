/**
 * Created by nwilson on 6/8/2015.
 */
//Link dependencies
var express = require('express');
var Forecast = require('forecast.io');
var fs = require('fs');

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

var contactInformation;

app.use(express.static('../ClientSide/', {
    extensions: ['html']
}));

//Start web server
var server = app.listen(port, function () {
    //Initialize
    getWeather();
    getContacts();

    //Server started
    console.log('Denko-Board server running on port ' + port);
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
        if (err) throw err; //Todo need proper error handling here

        //Currently weather handling
        if(data.currently){
            var currently = data.currently;
            var currentDate = new Date(currently.time * 1000);
            currentDate.setMinutes(0);
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);
            weather.currently = {
                'date': (currently.time) ? currentDate.toLocaleDateString() : 'ERROR',
                'time': (currently.time) ? currentDate.toLocaleTimeString() : 'ERROR',
                'temperature': (currently.temperature) ? Math.round(currently.temperature) : 'ERROR',
                'conditions': (currently.summary) ? currently.summary : 'ERROR',
                'image': (currently.icon) ? weatherImageSet + currently.icon + '.png' : ''
            };
        }

        //Todo how should errors be dealt with client side?

        //Hourly weather handling
        weather.hourly = [];
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
                //Todo Needs proper error checking. What if one doesn't have time?
                if(hourObj.time.substring(0,2) != weather.currently.time.substring(0,2)){
                    weather.hourly.push(hourObj);
                    j++;
                }
            }
        }

        //Severe weather alert handling
        weather.alert = [];
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
    //Pushes new weather info to all clients
    io.emit('updateWeather', weather);
    //Weather was retrieved, parsed, and pushed successfully
    console.log('Updated weather conditions received, parsed, and pushed');
    //Schedules weather refresh every 3 minutes
    setTimeout(getWeather, 180000);
};

//Updates contactInformation with values in file and sends to all clients
var getContacts = function(){
    fs.readFile('contactInformation.json', function(err, data){
        if(err){
            console.log(err);
        } else{
            contactInformation = JSON.parse(data);
            io.emit('updateContactInfo', contactInformation);
        }
    });
};

//Writes new contact info to file and calls getContacts()
var setContacts = function(contacts){
    fs.writeFile('contactInformation.json', JSON.stringify(contacts, null, 4), function(err){
        if(err) {
             console.log(err);
        } else{
            getContacts();
        }
    });
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
    //On connect, send client current info
    socket.emit('updateWeather', weather);
    socket.emit('updateContactInfo', contactInformation);

    /*
    ** Client Requests
    */

    //Request for current weather condiitons
    socket.on('getWeather', function(){
        socket.emit('updateWeather', weather)
    });

    //Request for current contact information
    socket.on('getContactInformation', function(){
       socket.emit('updateContactInfo', contactInformation);
    });

    //Sets updated contact information
    socket.on('updateContacts', function(data){
        setContacts(data);
    });

    //A user has disconnected
    socket.on('disconnect', function () {
        users--;
        console.log('A user has disconnected. Total users: ' + users);
    });
});