/**
 * Created by nwilson on 6/9/2015.
 */

//App definition
var app = angular.module('DenkoApp', []);

//Controller for all weather aspects
app.controller('weatherController' , function($scope) {
    socket.on('updateWeather', function (data) {
        console.log('Updated weather information has been received');
        if(data.currently){
            $scope.weather = data;
            $scope.$apply();
        } else {
            console.log('Received weather object was blank. Trying again...');
            setTimeout(function(){ socket.emit('getWeather');}, 1000);
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

//Controller for all information aspects
app.controller('infoController', function($scope){
    $scope.announcements = [
        { title: 'Time', comment: 'Get your time in by Friday'},
        { title: 'OOO', comment: "I'll be OOO Wednesday - Friday. Skype me if you have any problems"},
        { title: 'Pizza', comment: 'Pizza today!'}
    ];
    $scope.contactInformation = [
        { type: '4 Help Number', value: '123-456-7890'},
        { type: 'Office Number', value: '123-456-7890'},
        { type: 'Cell Number', value: '123-456-7890'},
        { type: 'Email Address', value: 'Bossman@email.com'},
        { type: 'Skype Name', value: 'Boss.man'}
    ];
});




