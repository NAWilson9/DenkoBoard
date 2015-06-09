/**
 * Created by nwilson on 6/9/2015.
 */

/// CONTROLLER DEFINITIONS
function weatherController($scope) {
    var weather = [
        { time: '8:00AM', temperature: '72F', conditions: 'Sunny', conditionsImage: ''},
        { time: '9:00AM', temperature: '72F', conditions: 'Sunny', conditionsImage: ''},
        { time: '10:00AM', temperature: '73F', conditions: 'Sunny', conditionsImage: ''},
        { time: '11:00AM', temperature: '73F', conditions: 'Sunny', conditionsImage: ''},
        { time: '12:00PM', temperature: '74F', conditions: 'Sunny', conditionsImage: ''},
        { time: '1:00PM', temperature: '74F', conditions: 'Sunny', conditionsImage: ''},
        { time: '2:00PM', temperature: '75F', conditions: 'Sunny', conditionsImage: ''},
        { time: '3:00PM', temperature: '74F', conditions: 'Sunny', conditionsImage: ''},
        { time: '4:00PM', temperature: '73F', conditions: 'Sunny', conditionsImage: ''},
        { time: '5:00PM', temperature: '72F', conditions: 'Sunny', conditionsImage: ''}
    ];
    $scope.weather = weather;
    socket.on('updateWeather', function (data) {
        console.log(JSON.stringify(data));
        $scope.weather = data;
        $scope.$apply();
    });
}

function musicController($scope){
    var songs = [
        { title: 'Summer', artist: 'Calvin Harris', albumArt: ''},
        { title: 'Detonate', artist: 'Netsky', albumArt: ''},
        { title: 'Fragile Earth', artist: 'UNQUOTE', albumArt: ''},
        { title: 'Green Destiny', artist: 'Fred V & Grafix', albumArt: ''},
        { title: 'Song in the Key of Knife', artist: 'London Elektricity', albumArt: ''},
        { title: 'Black Cloud', artist: 'Royalston', albumArt: ''},
        { title: 'Detroit', artist: 'Rockwell', albumArt: ''},
        { title: '1234', artist: 'Rockwell', albumArt: ''},
        { title: 'INeedU', artist: 'Rockwell', albumArt: ''},
        { title: 'Atlantis', artist: 'Enei', albumArt: ''}
    ];
    $scope.songs = songs;
}

function infoController($scope){
    var announcements = [
        { title: 'Time', comment: 'Get your time in by Friday'},
        { title: 'OOO', comment: "I'll be OOO Wednesday - Friday. Skype me if you have any problems"},
        { title: 'Pizza', comment: 'Pizza today!'}
    ];
    var contactInformation = [
        { type: '4 Help Number', value: '123-456-7890'},
        { type: 'Office Number', value: '123-456-7890'},
        { type: 'Cell Number', value: '123-456-7890'},
        { type: 'Email Address', value: 'Bossman@email.com'},
        { type: 'Skype Name', value: 'Boss.man'}
    ];
    $scope.announcements = announcements;
    $scope.contactInformation = contactInformation;
}

// APP DEFINITION
var app = angular.module('test', []);

/// CONTROLLERS
function default_registerController(name, cb){
    app.controller(name,
        [
            '$scope',
            cb
        ]);
}

default_registerController('weatherController', weatherController);
default_registerController('musicController', musicController);
default_registerController('infoController', infoController);




