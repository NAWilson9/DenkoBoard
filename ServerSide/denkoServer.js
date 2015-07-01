/**
 * Created by nwilson on 6/8/2015.
 */
//Link dependencies
var express = require('express');
var sockets = require('socket.io');
var Forecast = require('forecast.io');
var fs = require('fs');
var request = require('request');
var FeedParser = require('feedparser');

//Setup server
var app = express();
var io = sockets();
var server;
var port = 1337;

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

//Info setup
var contacts;
var announcements;

//News Setup
var news = [];
var feeds = ['http://feeds.feedburner.com/elise/simplyrecipes', 'http://feeds.feedburner.com/TechCrunch/'];

app.use(express.static('../node_modules/angular'));
app.use(express.static('../node_modules/bootstrap/dist/css'));
app.use(express.static('../node_modules/normalize-css'));
app.use(express.static('../ClientSide/', {
    index: 'client.html'
}));

/*
Server functions
 */

//Gets weather from server and parses it
var getWeather = function(startupCallback){
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
        //Pushes new weather info to all clients
        io.emit('receiveWeather', weather);
        //Weather was retrieved, parsed, and pushed successfully
        console.log('Updated weather conditions received, parsed, and pushed');
        //Handles callback if function is being called on server startup
        if(startupCallback){ startupCallback() }
    });
    //Schedules weather refresh every 3 minutes
    setTimeout(getWeather, 180000);
};

//Updates contacts with values in file and sends to all clients
var getContacts = function(startupCallback){
    fs.readFile('contacts.json', function(err, data){
        if(err){
            console.log(err);
        } else{
            contacts = JSON.parse(data);
            io.emit('receiveContacts', contacts);
        }
        //Handles callback if function is being called on server startup
        if(startupCallback){ startupCallback() }
    });
};

//Writes new contact info to file and calls getContacts()
var setContacts = function(contacts){
    fs.writeFile('contacts.json', JSON.stringify(contacts, null, 4), function(err){
        if(err) {
             console.log(err);
        } else{
            getContacts();
        }
    });
};

//Updates contacts with values in file and sends to all clients
var getAnnouncements = function(startupCallback){
    fs.readFile('announcements.json', function(err, data){
        if(err){
            console.log(err);
        } else{
            announcements = JSON.parse(data);
            io.emit('receiveAnnouncements', announcements);
        }
        //Handles callback if function is being called on server startup
        if(startupCallback){ startupCallback() }
    });
};

//Writes new contact info to file and calls getContacts()
var setAnnouncements = function(announcements){
    fs.writeFile('announcements.json', JSON.stringify(announcements, null, 4), function(err){
        if(err) {
            console.log(err);
        } else{
            getAnnouncements();
        }
    });
};

var feed = function(startupCallback){
    for(var i = 0; i < feeds.length; i++){
        request(feeds[i], function(error, response, html){
            var parser = new FeedParser();
            if(error){
                console.log('Request error: ' + error);
            } else if (response.statusCode !== 200){
                console.log('Request status code: ' + response.statusCode);
            } else{
                var stream = this;

                stream.pipe(parser);
                //console.log(stream);
                parser.on('error', function(error) {
                    console.log(error);
                });
                parser.on('readable', function() {
                    console.log('hype');
                    var stream = this;
                    var meta = this.meta;
                    var item;

                    while (item = stream.read()) {
                        var feedData = {
                            'source': meta.title,
                            'sourceImg': meta.image.url,
                            'title': item.title,
                            'imgUrl': item.image.url
                        };
                        news.push(feedData);
                        console.log(feedData);
                    }
                });
            }
        });
    }
    if(startupCallback){ startupCallback() }
};


//Handles the initial server setup before starting
var initializeServer = function(functions, startServer) {
    var progress = 0;
    var completion = functions.length;
    //Callback for each startup method
    var callback = function () {
        progress++;
        if(progress === completion){
            //All setup is finished
            console.log('All setup completed');
            startServer();
        }
    };
    //Invokes all linked functions
    for (var i = 0; i < completion; i++) {
        functions[i](callback);
    }
};

//Starts the server
(startServer = function(){
    //Link required startup methods
    var functions = [getWeather, getContacts, getAnnouncements, feed];

    //What to do once initialization finishes
    var start = function(){
        //Starts the Express server
        server = app.listen(port, function () {
            //Server started
            console.log('Denko-Board web server running on port ' + port);

            //Start socket server
            io.listen(server);
            console.log('Denko-Board socket server running on port ' + port);
            console.log(news);
        });
    };
    initializeServer(functions, start);
})();

/*
 Websocket stuff
 */

//Socket routes
io.on('connection', function (socket) {
    console.log('A user has connected. Total users: ' + io.engine.clientsCount);

    //On connect, send client current info
    socket.emit('receiveWeather', weather);
    socket.emit('receiveAnnouncements', announcements);
    socket.emit('receiveContacts', contacts);

    /*
    ** Client Requests
    */

    //Sets updated contact information
    socket.on('storeContacts', function(data){
        setContacts(data);
    });

    //Sets updated announcement information
    socket.on('storeAnnouncements', function(data){
        setAnnouncements(data);
    });

    //A user has disconnected
    socket.on('disconnect', function () {
        console.log('A user has disconnected. Total users: ' + io.engine.kclientsCount);
    });
});