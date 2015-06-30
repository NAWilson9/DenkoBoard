/**
 * Created by nwilson on 6/9/2015.
 */

//App definition
var app = angular.module('denkoApp', []);

//Controller for all weather aspects
app.controller('weatherController' , function($scope) {
    socket.on('receiveWeather', function (data) {
        console.log('Updated weather information has been received');
        if(data.currently){
            $scope.weather = data;
            $scope.$apply();
        }
    });
});

//Controller for all information aspects
app.controller('infoController', function($scope, $timeout){
    $scope.contacts = {};
    $scope.announcements = {};
    $scope.clock = "Loading clock...";

    //Updates the clock every second
    $scope.tick = function () {
        $scope.clock = Date.now();
        $timeout($scope.tick, 1000);
    };


    //Receives updated contacts
    socket.on('receiveContacts', function(data){
        if(data && data.length){
            console.log('Updated contacts have been received');
            $scope.contacts = data;
            $scope.$apply();
        }
    });

    //Receives updated announcements
    socket.on('receiveAnnouncements', function(data){
        if(data && data.length){
            console.log('Updated announcements have been received');
            $scope.announcements = data;
            $scope.$apply();
        }
    });
});

//Controller for all music aspects
app.controller('musicController', function($scope){
    $scope.songs = [
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
});